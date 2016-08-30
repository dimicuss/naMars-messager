'use strict';

module.exports = function (config) {
    var request     = require('request');
    var sendTo      = require('./loginVk')( config.number,
					    config.pass,
					    config.appId )
    var baseUrl     = 'https://api.vk.com/method/';
    var version     = '5.53';
    var accessToken = config.accessToken;

   
        
    
    var markAsReadAndResend = function (message) {
	var messageId     = message.updates[0][1],
	    messageText   = message.updates[0][6],
	    messageSender = message.updates[0][3],
	    messageHeader = config.header,
	    reqUrl = baseUrl      +
	    'messages.markAsRead' +
	    '?access_token='      +
	    accessToken           +
	    '&message_ids='       +
	    messageId             +
	    '&version='           +
	    version;
	
	messageText = 'Ваше сообщение: ' + messageText;
	
	request.post( reqUrl, function(err, res, body) { 
	    if (!err && res.statusCode == 200) {
		sendTo(messageSender, messageText, messageHeader);
		return
	    }
	    else {
		console.error(err);
		return;
	    }	
	})
    }

    
    var setLongPollHandler = function(key) {
	console.log( '==== Устновка Long Poll Server ====');
	var reqUrl = 'https://' +
	    key.server          +
	    '?act=a_check&key=' +
	    key.key             +
	    '&ts='              +
	    key.ts              +
	    '&wait=25&mode=2';
	
	console.log('=== URL Long Poll запроса ' + reqUrl + ' ===');
	
	request.get( reqUrl, function(err, res, message) {
	    var cond;
	    message = JSON.parse(message) 
		
	    if (!err && res.statusCode == 200) {
		console.log('=====Ответ=====');
		console.log(message);
		console.log();
		cond =
		    message.updates        &&
		    message.updates.length &&
		    message.updates[0][0] == 4;

		if(message.failed) {
		    console.log('=== Сообщение с фэйлом ===')
		    console.log(message.failed);
		    
		    switch(message.failed) {
		    case 1:
			key.ts = message.ts;
			setLongPollHandler(key);
			break;
			
		    case 2:
		    case 3:
			setLongPollServer();
			break
		    case 4:
			console.error('Invalid version!!')
			break
		    }
		    return;
		}
		
		if(cond) {
		    markAsReadAndResend(message);
		}
		
		key.ts = message.ts;
		setLongPollHandler(key);
	    }
	    else {
		console.error(err);
	    }
	})
    }
    
    
    var setLongPollServer = function() {
	var url    = 'messages.getLongPollServer';
	var reqUrl =
	    baseUrl + url    +
	    '?access_token=' +
	    accessToken;
	
	console.log('==== Посылка запроса на получение ключа ====');
	
	request.get( reqUrl, function(err, res, key) {
	    if (!err && res.statusCode == 200) {
		key = JSON.parse(key);
		
		console.log('==== Ключ ====')
		console.log(key);
		console.log()
		
		setLongPollHandler(key.response);
	    }
	    else {
		console.error(err)
	    }
	})
	
    }	
    
    
    
    setLongPollServer();
}

