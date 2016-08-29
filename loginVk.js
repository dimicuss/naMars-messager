module.exports = function(number, pass, appId) {
    var VK = require('./node_modules/vk');
    var vk = new VK.API(appId, 'all', '5.53');

    var login = vk.login(number, pass);

    return function (to, message, header)  {
	var messenger = function () {
	    return vk.api( 'messages.send', {
		user_id         : to,
		message         : message,
		title           : header ? header : ''
	    })
	}
	login.then(messenger)
    }
    
}
