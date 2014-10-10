OGP Action Plan Lead Generator
==============================

This code pulls Open Government Partnership action plans down, converts them to text, and scans through them for text matching the string or strings passed to `make`.

Matching documents are placed in the `matches` directory.


Requirements
------------
* [NodeJS](http://nodejs.org/)
* [Homebrew](http://brew.sh/)


Installation
------------
    npm install
    brew install xpdf antiword pandoc

Usage
-----
```
make fetch
make extract
make search MATCH="opendata|transparency"
```

Then have a look in the `matches` directory for files that are worth investigating.

To clean that directory and conduct a new search:

```
make newsearch
make search MATCH="geo|spatial|carto"
```