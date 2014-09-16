var settings = require('./settings.js');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

function extractSingleCountryActionPlanURL(data, callback){
    var URLPrefix = settings.OGP_COUNTRY_ROOT.replace(/(http:\/\/(.*?)\/).*$/, '$1')
    url = URLPrefix + data.url.replace(/^\/(.*)$/, '$1') + '/action-plan';
    request(url, function(error, response, html) {
        if(!error && response.statusCode === 200){
            var $ = cheerio.load(html);
            $('.view-action-plan-on-country-page .file a').each(function(index, element){
                console.log($(this).attr('href'));
            });
        }
        callback();
    });
}

function collectAllCountryActionPlanURLs(){
    // use a queue to prevent slamming the server with more than 2 simultaneous requests
    q = async.queue(extractSingleCountryActionPlanURL, settings.SIMULTANEOUS_WEB_WORKERS);

    // fetch the country list and iterate through each URL
    request(settings.OGP_COUNTRY_ROOT, function (error, response, html) {
        if(!error && response.statusCode === 200){
            var $ = cheerio.load(html);
            $('.view-ogp-countries .views-field-title-field .field-content a').each(function(index, element){
                q.push({
                    country: $(this).text(),
                    url: $(this).attr('href')
                });
            });
        }
    });
}

module.exports = {
    collectAllCountryActionPlanURLs: collectAllCountryActionPlanURLs
}

if (require.main === module) {
    collectAllCountryActionPlanURLs();
}