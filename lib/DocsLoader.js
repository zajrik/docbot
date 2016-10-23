// https://raw.githubusercontent.com/zajrik/yamdbf/master/docs/docs.json
const request = require('request-promise');

exports.default = class DocsLoader
{
	constructor()
	{
		this.docs = {};
	}

	// Get docs.json from repo and parse it into sections
	loadDocs(message)
	{
		return request({ uri: 'https://raw.githubusercontent.com/zajrik/yamdbf/master/docs/docs.json', json: true })
			.then(json =>
			{
				this.docs = json;
				if (message) message.edit('Docs successfully loaded.') // eslint-disable-line
					.then(msg => msg.delete(5000));
				console.log('Successfully loaded docs.');
			})
			.catch(() =>
			{
				if (message) message.edit('Failed to fetch docs.') // eslint-disable-line
					.then(msg => msg.delete(5000));
				console.log('Failed to fetch docs.');
			});
	}
};
