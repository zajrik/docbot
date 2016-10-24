let Command = require('yamdbf').Command;

exports.default = class DocsColon extends Command
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
					+ `**Typedefs:**\n\`${this.bot.docsLoader.docs.typedefs.map(a => a.name).join('`, `')}\`\n\n`
					+ `Use \`'docs: <class>'\` for more information.`);
			}
			if (args[0] === 'reload')
			{
				return message.channel.sendMessage('Reloading docs...')
					.then(msg => this.bot.docsLoader.loadDocs(msg));
			}
			return this.bot.docsLoader.fetchArticle(args.join(' '))
				.then(res => message.channel.sendMessage(res))
				.catch(err => message.channel.sendMessage(err));
		}
		catch (err)
		{
			return console.log(err);
		}
	}
};
