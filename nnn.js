var urlProduct = 'https://www.amazon.de/Aktiv-Organic-Ashwagandha-Pulver-250g/dp/B00P448CWU/';

var casper = require('casper').create();
// required in ordner to retrieve amazon cookies
// casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');
casper.userAgent('Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36');

// open product page
casper.start(urlProduct);
console.log('visiting ', urlProduct);

casper.then(function() {
    this.capture('product.png');
    console.log('adding product to cart');
    this.click('#add-to-cart-button');
    this.capture('cart-add.png');
});

casper.then(function() {
    console.log('visiting cart');
    this.click('#hlb-view-cart-announce');
    this.capture('cart.png');
});

casper.then(function() {
    console.log('setting amount of items to 999');
    this.click('#a-autoid-0-announce');
    this.click('#dropdown1_9');
    this.sendKeys('activeCartViewForm > div.sc-list-body > div > div.sc-list-item-content > div.a-row.a-spacing-base.a-spacing-top-base > div.a-column.a-span2.a-text-right.sc-action-links.a-span-last > div > div > input', '999');
    this.click('a-autoid-1-announce');
    this.capture('amount.png');
});

casper.then(function() {
    console.log('selfie!');
    this.capture('result.png');
});

casper.run();
