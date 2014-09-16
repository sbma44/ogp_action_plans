OGP Action Plan Lead Generator
==============================

This code pulls Open Government Partnership action plans down, converts them to text, and scans through them for text matching the value specified in the first line of Makefile. Supports pdf, doc and docx.

Matching documents are placed in the `action_plan_hits` directory.


Requirements
------------
* [NodeJS](http://nodejs.org/)
* [Homebrew](http://brew.sh/)


Installation
------------
    npm install
    brew install xpdf antiword pandoc