/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	meta: function(req,res){
		var params = req.params.all();
		var request = require('request').defaults({maxRedirects:10});
		var cheerio = require('cheerio');
		
		var options =  {
		    url: params.url,
		    jar: request.jar(),
		    headers: {
		        'User-Agent': 'webscraper'
		    }
		};
		request(options, function(error, response, html){
	        if(error){
	        	console.log(error)
	        	return res.end();
	        }
	        var $ = cheerio.load(html);
	        var json={};
	        var data =["og:title","og:url","og:image","og:description"];
	        for (var i=0;i<data.length;i++){
	        	json[data[i]] = $('meta[property="'+data[i]+'"]')[0].attribs.content;
	        }
	        res.type('application/json');
	        res.json(json);
	    })
	},
	search:function(req,res){
		var params = req.params.all();
		var request = require('request').defaults({maxRedirects:10});
		var options =  {
		    url: "https://www.myntra.com/web/v2/search/data/"+params.q+"?f=&p="+params.page+"&rows="+params.rows,
		    jar: request.jar(),
		    headers: {
		        'User-Agent': 'webscraper'
		    }
		};
		request(options, function(error, response, html){
	        if(error){
	        	console.log(error)
	        	return res.end();
	        }
	        html = JSON.parse(html)
	        res.send(html.data.results.products)
	    });
	},
	search_scrapper: function(req,res){
		var params = req.params.all();
		var request = require('request').defaults({maxRedirects:10});
		var options =  {
		    url: "https://www.myntra.com/"+params.q+"?userQuery=true",
		    jar: request.jar(),
		    headers: {
		        'User-Agent': 'webscraper'
		    }
		};
		request(options, function(error, response, html){
	        if(error){
	        	console.log(error)
	        	return res.end();
	        }
	        html = "{"+html.slice(html.indexOf('"products":'))
	        html = html.slice(0,html.indexOf('}]}')+3)
	        res.send(JSON.parse(html))
	    })	
	}
};

