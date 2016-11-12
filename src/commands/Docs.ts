'use strict';
import { Bot, Command } from 'yamdbf';
import { User, Message } from 'discord.js';
import Class from '../lib/docs/Class';
import Method from '../lib/docs/Method';
import Property from '../lib/docs/Property';
import Typedef from '../lib/docs/Typedef';
import DocBot from '../lib/bot/DocBot';

export default class Docs extends Command
{
	public constructor(bot: Bot)
	{
		super(bot, {
			name: 'docs',
			aliases: ['docs:', 'docs,'],
			description: 'Provides information from YAMDBF documentation',
			usage: 'docs: <class>[.property|method]',
			extraHelp: '',
			group: 'base'
		});
	}

	public async action(message: Message, args: Array<string | number>, mentions: User[], original: string): Promise<any>
	{
		if (args[0] === 'help')
		{
			return message.channel.sendMessage(`**Classes:**\n`
				+ `\`${(<DocBot> this.bot).docs.classes.map(a => a.name).join('`, `')}\`\n\n`
				+ `**Typedefs:**\n\`${(<DocBot> this.bot).docs.typedefs.map(a => a.name).join('`, `')}\`\n\n`
				+ `Use \`'docs: <class|typedef>[.property|.method]'\` for more information.`);
		}
		if (args[0] === 'reload')
		{
			return message.channel.sendMessage('Reloading docs...')
				.then((msg: Message) => (<DocBot> this.bot).docs.loadDocs(msg));
		}
		if (args[0] === 'eval' && (<any> this.bot.config).owner.includes(message.author.id))
			return this.bot.commands.get('docs:eval')
				.action(message, args, mentions, original.replace(/.+eval /, ''));

		let name: string = args.join(' ').toLowerCase()
			.replace(/[\.#\,\/ ]/g, '.').replace(/\(\)/, '').replace(/\.+/, '.');
		let doc: Class | Method | Property | Typedef = (<DocBot> this.bot).docs.all.get(name);
		if (!doc) return message.channel.sendMessage(`Couldn't find entry ${args.join('')}`);
		return message.channel.sendMessage(doc.toString());
	}
}
