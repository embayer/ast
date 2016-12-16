var casper = require('casper').create({
    verbose: true,
    logLevel: 'error'
});

// url is mandatory
if (casper.cli.args.length === 0 && Object.keys(casper.cli.options).length === 0) {
    casper.log('url param required', 'error').exit();
}
var url = casper.cli.get(0);

// required in ordner to retrieve amazon cookies
// macOS Chrome
casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36');

function isSessionVerbose () {
    return casper.options.verbose;
}

function getTimestamp () {
    var date = new Date(),
        day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear(),
        hour = date.getHours(),
        minute = date.getMinutes();

    return year + '-' + month + '-' + day + '-' + hour + '_' + minute;
}

function captureHTML (fileName) {
    casper.then(function() {
        var fs = require('fs'),
            html = this.getHTML(),
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

    console.log(getTimestamp() + msg + newlineChar);
}

// objective
var inStock = 0;

// open product page
casper.start(url);
casper.log('shopping! 💁 👗 💍 👠 👛', 'info');
casper.log('visiting ' + url, 'debug');

casper.then(function() {
    this.log('checking bot check 🤖', 'debug');
    if (this.getTitle() === 'Bot Check') {
        this.log('busted 👮 🚓', 'error');
        this.exit();
    }
});

casper.then(function() {
    this.log('adding product to cart 🎁', 'debug');
    this.click('#add-to-cart-button');
});

casper.then(function() {
    this.log('visiting cart 🛍', 'debug');
    this.click('#hlb-view-cart');
});

casper.then(function() {
    this.log('setting amount of items to 999 😎 💳', 'debug');
    this.log('click dropdown');
    this.click('#a-autoid-0-announce');
});

casper.waitForSelector('#dropdown1_9', function() {
    this.log('click 10+', 'debug');
    this.click('#dropdown1_9');
});

casper.then(function() {
    this.log('sending keys', 'debug');
    this.sendKeys('#activeCartViewForm > div.sc-list-body > div > div.sc-list-item-content > div.a-row.a-spacing-base.a-spacing-top-base > div.a-column.a-span2.a-text-right.sc-action-links.a-span-last > div > div > input', '999', {keepFocus: true});
    this.sendKeys('#activeCartViewForm > div.sc-list-body > div > div.sc-list-item-content > div.a-row.a-spacing-base.a-spacing-top-base > div.a-column.a-span2.a-text-right.sc-action-links.a-span-last > div > div > input', this.page.event.key.Enter, {keepFocus: true});
});

// casper.waitForSelector('#a-autoid-1-announce', function() {
//     this.log('accepting', 'debug');
//     this.click('#a-autoid-1-announce');

//     // casper.waitForSelector('#activeCartViewForm > div.sc-list-body > div > div.sc-list-item-content > div.sc-quantity-update-message.a-spacing-top-mini > div > div', function() {
//     // // casper.waitForSelector('#activeCartViewForm > div.sc-list-body > div:nth-child(2) > div.sc-list-item-content > div.sc-quantity-update-message.a-spacing-top-mini > div > div', function() {
//     //     this.log('error box is here', 'debug');
//     //     this.capture('07.png');
//     //     getHTML('07.html');
//     //     var inStock = this.evaluate(function() {
//     //         return document.querySelector('#activeCartViewForm > div.sc-list-body > div > div.sc-list-item-content > div.sc-quantity-update-message.a-spacing-top-mini > div > div > div > span').innerText.match(/\d+/)[0];
//     //     });
//     //     var tabChar = '\t',
//     //         newlineChar = '\n';
//     //     casper.log(timestamp + tabChar + url + tabChar + inStock + newlineChar, 'info');
//     // });
// });

// waiting for the error box saying sry no more than x items in stock
casper.waitForSelector('#activeCartViewForm > div.sc-list-body > div > div.sc-list-item-content > div.sc-quantity-update-message.a-spacing-top-mini > div > div', function() {
    this.log('error box is here', 'debug');

    // extract stock amount from error message
    inStock = this.evaluate(function() {
        return document.querySelector('#activeCartViewForm > div.sc-list-body > div > div.sc-list-item-content > div.sc-quantity-update-message.a-spacing-top-mini > div > div > div > span').innerText.match(/\d+/)[0];
    });
    log(url, inStock);
});

casper.then(function() {
    if (inStock === 0) {
        this.log('stock amount > 999', 'error');
        inStock = '999';
        log(url, inStock);
    }
});

casper.run();
