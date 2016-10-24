let Command = require('yamdbf').Command;

exports.default = class DocsSpace extends Command
{
	constructor(bot)
	{
		super(bot, {
			name: 'docs',
			description: 'Provides information from YAMDBF documentation',
			usage: 'docs <arg>',
			extraHelp: '',
			group: 'base'
		});
	}

	action(message, args, mentions, original) // eslint-disable-line no-unused-vars
	{
		try
		{
			return this.bot.commands.get('docs:').action(message, args, mentions, original);
		}
		catch (err)
		{
			return console.log(err);
		}
	}
};
