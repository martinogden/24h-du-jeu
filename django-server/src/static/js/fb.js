;(function() {
var FB_AUTH_URL = config.urls['invite:facebook'];

var loggedIn = document.getElementById('fb-logged-in');
var loggedOut = document.getElementById('fb-logged-out');


/**
 * Promisified http request, returns json
 */
function postJSON(url, data) {
	var formData = new FormData();

	Object.keys(data).forEach(function(key) {
		formData.append(key, data[key]);
	});

	var xhr = new XMLHttpRequest();
	xhr.open('POST', url);

	return new Promise(function(resolve, reject) {
		xhr.onload = function() {
			var data = JSON.parse(xhr.response);
			resolve(data);
		};

		xhr.onerror = function() {
			reject(xhr.statusText);
		};
		xhr.setRequestHeader('X-CSRFToken', config.CSRF_TOKEN);
		xhr.send(JSON.stringify(data));
	});
}


/**
 * Send auth request to server
 */
var auth = function(authResponse) {
	var formData = {
		access_token: authResponse.accessToken,
		signed_request: authResponse.signedRequest,
		user_id: authResponse.userID,
		invite_player_id: config.INVITE_PLAYER_ID,
		invite_key: config.INVITE_KEY
	};
	return postJSON(FB_AUTH_URL, formData);
}


var statusChangeHandler = function (response) {
	switch(response.status) {
		case config.FB_STATUS_CONNECTED:
			auth(response.authResponse).then(function() {
				// loggedIn.style.display = 'block';
				// loggedOut.style.display = 'none';

				// Add redirect
				console.log('you are logged in via facebook <a href="javascript:FB.logout();">logout</a>');
			})
			break;

		default:
			// loggedIn.style.display = 'none';
			// loggedOut.style.display = 'block';
			break;
	}
}


window.fbAsyncInit = function() {


	FB.init({
		appId: config.FACEBOOK_CLIENT_ID,
		cookie: true,
		xfbml: true,
		status: true,
		version: 'v2.5'
	});

	FB.Event.subscribe('auth.statusChange', statusChangeHandler);

	FB.Event.subscribe('auth.logout', function(response) {
		console.log('you logged out via facebook');
	});

	document.getElementById("fb-login").addEventListener('click', function() {
		FB.login(statusChangeHandler, { scope: config.FB_SCOPE });
	})
}
})();