module.exports = {
	port: 5050,
	name: 'chat-app',
	dbHost: 'localhost',
	dbUserName: 'root',
	dbPassword: '',
	dbName: 'chat_app',
	saltRounds: 2,
	jwtSecret: 'chat_app_system@159*',
	domain: 'http://localhost:5050',
	getServerUrl(req) {
		var serverURL = 'http://localhost:5050/';
		return serverURL;
	}
}