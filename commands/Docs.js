let Command = require('yamdbf').Command;
var link = 'https://zajrik.github.io/yamdbf';

exports.default = class Help extends Command
{
	constructor(bot)
	{
		super(bot, {
			name: 'docs:',
			description: 'Provides information from YAMDBF documentation',
			usage: 'docs: <arg>',
			extraHelp: '',
			group: 'base'
		});
	}

	action(message, args, mentions, original) // eslint-disable-line no-unused-vars
	{
		try
		{
			if (args[0] === 'help')
			{
				return message.channel.sendMessage(`**Classes:**\n`
					+ `\`${this.bot.docsLoader.docs.classes.map(a => a.name).join('`, `')}\`\n\n`
					+ `Use \`'docs: <class>'\` for more information.`);
			}
			if (args[0] === 'reload')
			{
				return message.channel.sendMessage('Reloading docs...')
					.then(msg => this.bot.docsLoader.loadDocs(msg));
			}
			else
			{
				let entry = args[0].split('.').map(a => a.toLowerCase());
				let className;
				let result;
				if (entry.length > 1)
				{
					entry[1] = entry[1].replace(/\(\)/, '');
					let end;
					result = this.bot.docsLoader.docs.classes.filter(a => a.name.toLowerCase() === entry[0])[0];
					if (!result) return message.channel.sendMessage(`Couldn't find entry: \`'${entry[0]}'\``);
					className = result.name;
					end = result.properties ? result.properties.filter(a => a.name.toLowerCase() === entry[1])[0]
						: null;
					if (end)
					{
						// Send property information
						return message.channel.sendMessage(`\`${className}.${end.name}\`\n\n`
							+ `${end.description}\n\n`
							+ `**type:** \`${end.type.names.join('`, `').replace(/external:/g, '')}\`\n\n`
							+ `**Docs:** ${link}/${className}.html#${end.name}`);
					}
					else
					{
						end = result.functions.filter(a => a.name.toLowerCase() === entry[1])[0];
						if (end) // eslint-disable-line
						{
							// Send method information
							return message.channel.sendMessage(`\`${className}.${end.name}(${end.parameters
								.map(a => a.name).join(', ')})\`\n`
								+ `\n${end.parameters.map(a => `\`<${typeof a.type !== 'string'
									? a.type.join('|').replace(/external:/g, '')
									: a.type.replace(/external:/g, '')}> ${a.name}\`\n${a.description}\n`).join('\n')}`
								+ `${end.parameters.length ? '\n' : ''}${end.description
									.replace(/\[.+\]/g, '')
									.replace(/external:/g, '')
									.replace(/\{@link (.+)\}/g, '$1')}\n\n`
								+ `${end.returns ? `**returns:** \`${end.returns.type.replace(/external:/g, '')}\`\n\n` : ''}`
								+ `**Docs:** ${link}/${className}.html#${end.name}`);
						}
					}
					return message.channel.sendMessage(`Couldn't find entry: \`'${className}.${entry[1]}'\``);
				}
				else
				{
					result = this.bot.docsLoader.docs.classes.filter(a => a.name.toLowerCase() === entry[0])[0];
					if (result)
					{
						// Send class information
						return message.channel.sendMessage(
							`\`${result.name}: new ${result.name}(${result.constructor.parameters
								.map(a => a.name).join(', ')})\`\n\n`
							+ `**Params**:\n${result.constructor.parameters.length
								? result.constructor.parameters.map(a => `\`<${typeof a.type !== 'string' // eslint-disable-line
									? a.type.join('|').replace(/external:/g, '')
									: a.type.replace(/external:/g, '')}> ${a.name}\`\n${a.description}\n`).join('\n') + '\n'
								: 'none\n\n'}`
							+ `${result.properties ? `**Properties:**\n\`${result.properties
								.map(a => a.name).join('`, `')}\`\n\n` : ''}`
							+ `${result.functions ? `**Methods:**\n\`${result.functions
								.map(a => `${a.name}()`).join('`, `')}\`\n\n` : ''}`
							+ `**Docs:** ${link}/${result.name}.html\n\n`
							+ `Use \`docs: ${result.name}.<property|method>\` for more information`);
					}
					return message.channel.sendMessage(`Couldn't find entry: \`'${args[0]}'\``);
				}
			}
		}
		catch (err)
		{
			return console.log(err);
		}
	}
};
