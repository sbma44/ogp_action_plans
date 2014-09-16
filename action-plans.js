var settings = require('./settings.js');
var stream = require('stream');
var through = require('through');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var eventstream = require('event-stream');

function extractSingleCountryActionPlanURLs(data, callback){
    url = data.url + '/action-plan';

    request(url, function(error, response, html) {
        if(!error && response.statusCode === 200){
            var $ = cheerio.load(html);    
            var out = [];
            $('.view-action-plan-on-country-page .file a').each(function(index, element){
                out.push($(this).attr('href'))                
            });
            callback(null, out);
        }
        else {
            callback(new Error('received HTTP ' + response.statusCode + ' response'));
        }
    });
}

var countryURLEmitter = stream.Readable({ objectMode: true });
countryURLEmitter._read = function(){
    // only fetch once
    if(countryURLEmitter.stopFetching!==true){        

        var URLPrefix = settings.OGP_COUNTRY_ROOT.replace(/(http:\/\/(.*?))\/.*$/, '$1')
        
        // fetch the country list and iterate through each URL
        request(settings.OGP_COUNTRY_ROOT, function (error, response, html) {
        
            if(!error && response.statusCode === 200){
                var $ = cheerio.load(html);
                var countryLinks = $('.view-ogp-countries .views-field-title-field .field-content a');            
                countryLinks.each(function(index, element){                
                    // queue up the next country object
                    var r = countryURLEmitter.push({
                        url: URLPrefix + $(this).attr('href'),
                        country: $(this).text()
                    });

                    // indicate if this is the last link
                    if(index===(countryLinks.length-1)){
                        countryURLEmitter.push(null);        
                    }
                });
                
            }
        });
    }
    // we've made a request, its callback will take things from here
    countryURLEmitter.stopFetching = true;
}

var actionPlanExtractor = eventstream.map(extractSingleCountryActionPlanURLs);

module.exports = {
    countryURLEmitter: countryURLEmitter,
    extractSingleCountryActionPlanURLs: extractSingleCountryActionPlanURLs
};

if (require.main === module) {
    var arraySplitter = through(function(data){
        data.forEach(function(data) {
            console.log(data);
        });
    });

    countryURLEmitter.pipe(actionPlanExtractor).pipe(arraySplitter);
}