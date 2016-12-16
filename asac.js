var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug'
});

// url is mandatory
if (casper.cli.args.length === 0 && Object.keys(casper.cli.options).length === 0) {
    casper.log('url param required', 'error').exit();
}

var url = casper.cli.get(0);

var date = new Date(),
    day = date.getDate(),
    month = date.getMonth() + 1,
    year = date.getFullYear(),
    hour = date.getHours(),
    minute = date.getMinutes();

var timestamp = year + '-' + month + '-' + day + '-' + hour + '_' + minute;

// required in ordner to retrieve amazon cookies
// macOS Chrome
casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36');

function getHTML(fileName) {
    casper.then(function() {
        var fs = require('fs');
        var html = this.getHTML();
        var f = fs.open(fileName, 'w');
        f.write(html);
        f.close();
    });
}

// open product page
// casper.start(url);
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
    this.capture('01.png');
    getHTML('01.html');
    this.log('adding product to cart 🎁', 'debug');
    this.click('#add-to-cart-button');
});

casper.then(function() {
    this.log('visiting cart 🛍', 'debug');
    this.click('#hlb-view-cart');
    this.capture('02.png');
    getHTML('02.html');
});

casper.then(function() {
    this.log('setting amount of items to 999 😎 💳', 'debug');
    this.log('click dropdown');
    this.click('#a-autoid-0-announce');
    this.capture('03.png');
    getHTML('03.html');
});

casper.waitForSelector('#dropdown1_9', function() {
// casper.then(function() {
    this.log('click 10+', 'debug');
    this.click('#dropdown1_9');
    this.capture('04.png');
    getHTML('04.html');
});

casper.then(function() {
    this.log('sending keys', 'debug');
    // this.sendKeys('#activeCartViewForm > div.sc-list-body > div > div.sc-list-item-content > div.a-row.a-spacing-base.a-spacing-top-base > div.a-column.a-span2.a-text-right.sc-action-links.a-span-last > div > div > input', '999');
    this.sendKeys('#activeCartViewForm > div.sc-list-body > div > div.sc-list-item-content > div.a-row.a-spacing-base.a-spacing-top-base > div.a-column.a-span2.a-text-right.sc-action-links.a-span-last > div > div > input', '999', {keepFocus: true});
    this.sendKeys('#activeCartViewForm > div.sc-list-body > div > div.sc-list-item-content > div.a-row.a-spacing-base.a-spacing-top-base > div.a-column.a-span2.a-text-right.sc-action-links.a-span-last > div > div > input', this.page.event.key.Enter, {keepFocus: true});
    this.capture('05.png');
    getHTML('05.html');
});

casper.waitForSelector('#a-autoid-1-announce', function() {
    this.log('accepting', 'debug');
    this.click('#a-autoid-1-announce');
    this.capture('06.png');
    getHTML('06.html');

    // casper.waitForSelector('#activeCartViewForm > div.sc-list-body > div > div.sc-list-item-content > div.sc-quantity-update-message.a-spacing-top-mini > div > div', function() {
    // // casper.waitForSelector('#activeCartViewForm > div.sc-list-body > div:nth-child(2) > div.sc-list-item-content > div.sc-quantity-update-message.a-spacing-top-mini > div > div', function() {
    //     this.log('error box is here', 'debug');
    //     this.capture('07.png');
    //     getHTML('07.html');
    //     var inStock = this.evaluate(function() {
    //         return document.querySelector('#activeCartViewForm > div.sc-list-body > div > div.sc-list-item-content > div.sc-quantity-update-message.a-spacing-top-mini > div > div > div > span').innerText.match(/\d+/)[0];
    //     });
    //     var tabChar = '\t',
    //         newlineChar = '\n';
    //     casper.log(timestamp + tabChar + url + tabChar + inStock + newlineChar, 'info');
    // });
});

casper.waitForSelector('#activeCartViewForm > div.sc-list-body > div > div.sc-list-item-content > div.sc-quantity-update-message.a-spacing-top-mini > div > div', function() {
    this.log('error box is here', 'debug');
    this.capture('07.png');
    getHTML('07.html');
    var inStock = this.evaluate(function() {
        return document.querySelector('#activeCartViewForm > div.sc-list-body > div > div.sc-list-item-content > div.sc-quantity-update-message.a-spacing-top-mini > div > div > div > span').innerText.match(/\d+/)[0];
    });
    var tabChar = '\t',
        newlineChar = '\n';
    casper.log(timestamp + tabChar + url + tabChar + inStock + newlineChar, 'info');
});

casper.then(function() {
    this.log('selfie! 📷');
    this.capture('selfie.png');
});

casper.run();
