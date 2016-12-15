var urlProduct = 'https://www.amazon.de/Aktiv-Organic-Ashwagandha-Pulver-250g/dp/B00P448CWU/';

var casper = require('casper').create();
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
casper.start(urlProduct);
console.log('shopping! 💁 👗 💍 👠 👛')
console.log('visiting ', urlProduct);

casper.then(function() {
    this.capture('01.png');
    console.log('adding product to cart 🎁');
    this.click('#add-to-cart-button');
    getHTML('01.html');
});

casper.then(function() {
console.log('visiting cart 🛍');
    this.click('#hlb-view-cart');
    this.capture('02.png');
    getHTML('02.html');
});

casper.then(function() {
    console.log('setting amount of items to 999 😎 💳');
    console.log('click dropdown');
    this.click('#a-autoid-0-announce');
    this.capture('03.png');
    getHTML('03.html');
});

casper.waitForSelector('#dropdown1_9', function() {
// casper.then(function() {
    console.log('click 10+');
    this.click('#dropdown1_9');
    this.capture('04.png');
    getHTML('04.html');
});

casper.then(function() {
    console.log('sending keys');
    this.sendKeys('#activeCartViewForm > div.sc-list-body > div > div.sc-list-item-content > div.a-row.a-spacing-base.a-spacing-top-base > div.a-column.a-span2.a-text-right.sc-action-links.a-span-last > div > div > input', '999');
    this.capture('05.png');
    getHTML('05.html');
});

casper.waitForSelector('#a-autoid-1-announce', function() {
    console.log('accepting');
    this.click('#a-autoid-1-announce');
    this.capture('06.png');
    getHTML('06.html');
});

console.log('waiting for error box 🕑 👀');
casper.waitForSelector('#activeCartViewForm > div.sc-list-body > div:nth-child(2) > div.sc-list-item-content > div.sc-quantity-update-message.a-spacing-top-mini > div > div', function() {
    // the stock amount is now the value of the input element
    var inStock = document.queryselector('#activeCartViewForm > div.sc-list-body > div:nth-child(2) > div.sc-list-item-content > div.a-row.a-spacing-base.a-spacing-top-base > div.a-column.a-span2.a-text-right.sc-action-links.a-span-last > div > div > input').value;
    console.log(inStock);
});

casper.then(function() {
    console.log('selfie! 📷');
    this.capture('selfie.png');
});

casper.run();
