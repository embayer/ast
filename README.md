# amazon stock amount checker

[casperJS](http://casperjs.org/) script to check amazon product stock amounts.

## installation

Install casperJS

```sh
    # macOS
    brew install casperjs
```

## run

Utilize asac.js directly to check a single url.

```sh
    # single amazon product url
    casperjs --cookies-file=cookies.txt asac.js https://www.amazon.de/Some-Amazon-Product/dp/B00P448CWU/ >> data/products.log
```

### or

Utilize the wrapper script process_urls to check a list of urls provided by a text file.

```sh
    # from a amazon product url text file
    # $1: the file
    # $2: sleep timeout (to avoid capture) (optional)
    ./process_urls data/urls.txt 60|tee -a data/products.log
```
