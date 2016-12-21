# amazon stock tracker

[casperJS](http://casperjs.org/) script to check amazon product stock amounts.

## installation

Install casperJS

```sh
    # macOS
    brew install casperjs
```

Install [python 3.4.1](https://www.python.org/downloads/release/python-341/)

## run

Utilize ast.js directly to check a single url.

```sh
    # single amazon product url
    casperjs --cookies-file=cookies.txt ast.js https://www.amazon.de/Some-Amazon-Product/dp/B00P448CWU/ >> data/products.log
```

### or

Utilize the wrapper script scrape to check a list of urls provided by a text file.

```sh
    # from a amazon product url text file
    # $1: the file
    # $2: sleep timeout (to avoid capture) (optional)
    # remember to use the correct python version here
    ./scrape --url_file=data/urls.txt --timeout=500
```

## view the log

To extract the data filter by timestamp (yyyy-mm-dd_hh-mm).
The included script filter_log returns csv.

```sh
    # everything
    ./filter_log ./data/products.log

    # filter for a specific date
    ./filter_log ./data/products.log 2016-12-24
    # today
    ./filter_log ./data/products.log $(date +%Y-%m-%d-%H)

    # to make use of the yielded data pipe it into the clipboard
    ./filter_log ./data/products.log|pbcopy
    # and paste it into your favorite spreadsheet app

    # or write a csv file
    ./filter_log ./data/products.log > data/products.csv
```
