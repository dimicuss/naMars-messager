'use strict';

module.exports = function (config) {
    var request     = require('request');
    var sendTo      = require('./loginVk')(config.number,
					   config.pass,
					   config.appId)
    var baseUrl     = 'https://api.vk.com/method/';
    var version     = '5.53';
    var accessToken = config.accessToken;

   
        
    
    var markAsReadAndResend = function (message) {
	var messageId     = message.updates[0][1];
	var messageText   = message.updates[0][6]
	var messageSender = message.updates[0][3];
	var messageHeader = config.header;

	if( messageId && message.updates[0][0] == 4 ) {
	    var reqUrl = baseUrl      +
		'messages.markAsRead' +
		'?access_token='      +
		accessToken           +
		'&message_ids='       +
		messageId             +
		'&version='           +
		version;
	    
	    messageText = 'Ваше сообщение: ' + messageText;
	    request.post(reqUrl, function(err, res, body) { 
		if (!err && res.statusCode == 200) {
		    sendTo(messageSender, messageText, messageHeader);
		    return;
		}
		else {
		    console.error(err);
		    return;
		}	
	    })
	}
    }

    
    var setLongPollHandler = function(resp) {
	var reqUrl = 'https://' +
	    resp.server         +
	    '?act=a_check&key=' +
	    resp.key            +
	    '&ts='              +
	    resp.ts             +
	    '&wait=25&mode=2';
	
	request.get( reqUrl, function(err, res, body) {
	    var parsedResp = JSON.parse(body);

	    if (!err && res.statusCode == 200) {
		if(parsedResp.updates.length) {
		    markAsReadAndResend(parsedResp);
		}
		resp.ts = parsedResp.ts;
		setLongPollHandler(resp)
		return;
	    }
	    else {
		console.error(err);
		return;
	    }
	})
    }
    
    
    var setLongPollServer = function(params) {
	var url    = 'messages.getLongPollServer',
	    reqUrl = baseUrl + url +
	    '?access_token=' +
	    accessToken;
	
	request.get( reqUrl, function(err, res, body) {
	    if (!err && res.statusCode == 200) {
		var parsedResp = JSON.parse(body);
		console.log(parsedResp);
		setLongPollHandler(parsedResp.response);
	    }
	    else {
		console.error(err)
	    }
	})
	
    }	
    
    
    
    setLongPollServer();
}






	
