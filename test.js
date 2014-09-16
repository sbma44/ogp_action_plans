var test = require('tape');
var through = require('through');
var actionPlan = require('./action-plans.js');
var settings = require('./settings.js');

test('country URL retrieval test', function(t){
    t.plan(3);
    var countryURLs = [];
    actionPlan.countryURLEmitter.pipe(through(
        function data(data){
            countryURLs.push(data);
        },
        function end(){
            t.ok(countryURLs.length>0, 'Got more than zero country URLs');
            t.ok(countryURLs[0].url.substring(0,4)==='http', 'URLs seem to start with http(s)');
            t.ok(countryURLs[0].url.length > settings.OGP_COUNTRY_ROOT.length, 'URLs aren\'t just the root OGP_COUNTRY_ROOT');
        })
    );
});

test('action plan URL extraction test', function(t){
    t.plan(3);
    actionPlan.extractSingleCountryActionPlanURLs(
        { 
            url: 'http://www.opengovpartnership.org/country/united-states'
        }, 
        function(err, urls){
            t.ok(urls.length > 0, 'Found at least one URL for the US');
            t.ok(urls[0].substring(0,4) === 'http', 'URL starts with http(s)');
            t.ok(new Array('doc', 'docx', 'pdf').indexOf( urls[0].split('.').pop() ) >= 0, 'Filetype extension is doc, docx or pdf');
        }
    );
});