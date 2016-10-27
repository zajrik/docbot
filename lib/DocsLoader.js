// https://raw.githubusercontent.com/zajrik/yamdbf/master/docs/docs.json
const request = require('request-promise');
var link = 'https://yamdbf.js.org/';
function clean(text)
{
	return text
		.replace(/#/g, '.')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/external:/g, '')
		.replace(/\[[^\]]+\]/g, '')
		.replace(/(.+)\.(<.+>)/g, '$1$2')
		.replace(/\{@link ([^\}]+)\}/g, '`$1`');
}

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

	// Fetch information for the provided member from the docs
	fetchArticle(input)
	{
		return new Promise((resolve, reject) =>
		{
			let entry = input.split(/[.|#| ]/).map(a => a.toLowerCase());
			let className;
			let result;
			if (entry.length > 1)
			{
				entry[1] = entry[1].replace(/\(\)/, '');
				let end;
				result = this.docs.classes.filter(a => a.name.toLowerCase() === entry[0])[0];
				if (!result) return reject(`Couldn't find entry: \`'${entry[0]}'\``);
				className = result.name;
				end = result.properties ? result.properties.filter(a => a.name.toLowerCase() === entry[1])[0]
					: null;
				if (end)
				{
					// Send property information
					return resolve(`\`${className}.${end.name}\`\n\n`
						+ `${clean(end.description)}\n\n`
						+ `**type:** \`${clean(end.type.names.join('`, `'))}\`\n\n`
						+ `**Docs:** ${link}/${className}.html#${end.name}`);
				}
				end = result.functions ? result.functions.filter(a => a.name.toLowerCase() === entry[1])[0]
					: null;
				if (end) // eslint-disable-line
				{
					// Send method information
					return resolve(`\`${className}.${end.name}(${end.parameters
						.map(a => a.name).join(', ')})\`\n`
						+ `\n${end.parameters.map(a => `\`<${typeof a.type !== 'string'
							? clean(a.type.join('|'))
							: clean(a.type)}> ${a.name}\`\n${clean(a.description)}\n`).join('\n')}`
						+ `${end.parameters.length ? '\n' : ''}${clean(end.description)}\n\n`
						+ `${end.returns ? `**returns:** \`${clean(end.returns.type)}\`\n\n` : ''}`
						+ `**Docs:** ${link}/${className}.html#${end.name}`);
				}
				return reject(`Couldn't find entry: \`'${className}.${entry[1]}'\``);
			}
			else
			{
				result = this.docs.classes.filter(a => a.name.toLowerCase() === entry[0])[0];
				if (result)
				{
					// Send class information
					return resolve(`**${result.name}:** \`new ${result.name}(${result.constructor.parameters
						.map(a => a.name).join(', ')})\`\n\n`
						+ `**Params**:\n${result.constructor.parameters.length
							? result.constructor.parameters.map(a => `\`<${typeof a.type !== 'string' // eslint-disable-line
								? clean(a.type.join('|'))
								: clean(a.type)}> ${a.name}\`\n${clean(a.description)}\n`).join('\n') + '\n'
							: 'none\n\n'}`
						+ `**Description:**\n${clean(result.constructor.description)}\n\n`
						+ `${result.properties ? `**Properties:**\n\`${result.properties
							.map(a => a.name).join('`, `')}\`\n\n` : ''}`
						+ `${result.functions ? `**Methods:**\n\`${result.functions
							.map(a => `${a.name}()`).join('`, `')}\`\n\n` : ''}`
						+ `**Docs:** ${link}/${result.name}.html\n\n`
						+ `Use \`docs: ${result.name}.<property|method>\` for more information`);
				}
				result = this.docs.typedefs.filter(a => a.name.toLowerCase() === entry[0])[0];
				if (result)
				{
					// Send typedef information
					return resolve(`**${result.name}**\n\n`
						+ `**Properties:**\n${result.properties.length ? result.properties // eslint-disable-line
							.map(a => `\`<${typeof a.type !== 'string'
								? clean(a.type.join('|'))
								: clean(a.type)}> ${a.name}\`\n${clean(a.description)}`).join('\n\n') + '\n\n'
							: 'none\n\n'}`
						+ `**Description:**\n${clean(result.description)}\n\n`
						+ `**Docs:** ${link}/global.html#${result.name}`);
				}
				return reject(`Couldn't find entry: \`'${input}'\``);
			}
		});
	}
};
