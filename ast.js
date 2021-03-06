var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug'
});
casper.options.waitTimeout = 10000;

var fs = require('fs');

// var colorizer = require('colorizer').create('Colorizer');

// var casper.options.verbose = casper.cli.has('verbose');
var url = casper.cli.get(0),
    logFile = casper.cli.get(1);

// url is mandatory
if (casper.cli.args.length === 0 && Object.keys(casper.cli.options).length === 0) {
    // TODO check all params
    casper.log('url param required', 'error').exit(3);
}

// required in ordner to retrieve amazon cookies
// macOS Chrome
// TODO provide different useragents
casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36');


function isSessionVerbose () {
    return casper.options.verbose;
}

function getTimestamp () {
    function zeroPad(n, size) {
        var s = "000000000" + n;
        return s.substr(s.length - size);
    }

    var date = new Date(),
        day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear(),
        hour = zeroPad(date.getHours(), 2);
        minute = zeroPad(date.getMinutes(), 2);

    return year + '-' + month + '-' + day + '-' + hour + '_' + minute;
}

function captureHTML (fileName) {
    casper.then(function() {
        var html = this.getHTML(),
            f = fs.open(fileName, 'w');
        f.write(html);
        f.close();
    });
}

function log () {
    var tabChar = '\t',
        newlineChar = '\n',
        msg = '';

    for (var i = 0; i < arguments.length; i++) {
        msg += tabChar + arguments[i];
    }

    var logLine = getTimestamp() + msg + newlineChar;
    // console.log(colorizer.colorize(logLine));
    console.log(logLine);
    // write logfile
    fs.write(logFile, logLine, 'a');
}

function checkBotCheck () {
    casper.then(function() {
        this.log('checking bot check 🤖', 'debug');
        if (this.getTitle() === 'Bot Check') {
            this.log('busted 👮 🚓', 'error');
            this.exit(1);
        }
    });
}

function extractASIN(url) {
    var asinRegex = /\/([A-Z0-9]{10})/,
        match = asinRegex.exec(url);
    return match[1];
}

// objective
var stockAmount = 0;


var selectors = {
        productPage: {
            buttonAddToCart: '#add-to-cart-button',
            buttonViewCart: '#hlb-view-cart-announce'
        },
        cartPage: {
            buttonAmount: '#a-autoid-0-announce',
            dropdownTenPlus: '#dropdown1_9',
            inputCustomAmount: '#activeCartViewForm > div.sc-list-body > div > div.sc-list-item-content > div.a-row.a-spacing-base.a-spacing-top-base > div.a-column.a-span2.a-text-right.sc-action-links.a-span-last > div > div > input',
            divAmountNotAvailable: '#activeCartViewForm > div.sc-list-body > div > div.sc-list-item-content > div.sc-quantity-update-message.a-spacing-top-mini > div > div',
            spanAvailabilityInfo: '#activeCartViewForm > div.sc-list-body > div > div.sc-list-item-content > div.sc-quantity-update-message.a-spacing-top-mini > div > div > div > span'
        }
};


// open product page
casper.start(url);
casper.log('shopping! 💁 👗 💍 👠 👛', 'info');
casper.log('visiting ' + url, 'debug');

checkBotCheck();

casper.waitForSelector(selectors.productPage.buttonAddToCart,
    function success() {
        this.log('adding product to cart 🎁', 'debug');
        this.click(selectors.productPage.buttonAddToCart);
    },
    function fail() {
        // TODO write html on error?
        this.exit(2);
    }
);

casper.waitForSelector(selectors.productPage.buttonViewCart,
    function success() {
        this.log('visiting cart 🛍', 'debug');
        this.click(selectors.productPage.buttonViewCart);
    },
    function fail() {
        this.exit(2);
    }
);

casper.waitForSelector(selectors.cartPage.buttonAmount,
    function success() {
        this.log('setting amount of items to 999 😎 💳', 'debug');
        this.log('click dropdown');
        this.click(selectors.cartPage.buttonAmount);
    },
    function fail() {
        this.exit(2);
    }
);

casper.waitForSelector(selectors.cartPage.dropdownTenPlus,
    function success() {
        this.log('click 10+', 'debug');
        this.click(selectors.cartPage.dropdownTenPlus);
    },
    function fail() {
        this.exit(2);
    }
);

casper.waitForSelector(selectors.cartPage.inputCustomAmount,
    function success() {
        this.log('sending keys', 'debug');
        this.sendKeys(selectors.cartPage.inputCustomAmount, '999', {keepFocus: true});
        this.sendKeys(selectors.cartPage.inputCustomAmount, this.page.event.key.Enter, {keepFocus: true});
    },
    function fail() {
        this.exit(2);
    }
);

casper.waitForSelector(selectors.cartPage.spanAvailabilityInfo,
    function success() {
        this.log('error box is here', 'debug');

        // extract stock amount from error message

        // // TODO this should also work
        // stockAmount = this.evaluate(function() {
        //     return document.querySelector(selectors.cartPage.spanAvailabilityInfo).innerText;
        // });
        stockAmount = this.getElementInfo(selectors.cartPage.spanAvailabilityInfo).text.match(/\d+/)[0];

        var asin = extractASIN(url);
        log(asin, stockAmount, url);

    },
    function fail() {
        this.exit(2);
    }
);

// 999 is available
casper.then(function() {
    if (stockAmount === 0) {
        this.log('stock amount > 999', 'error');
        stockAmount = '999';
        var asin = extractASIN(url);
        log(asin, stockAmount, url);
    }
});

casper.run();
