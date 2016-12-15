'use strict';
import { Bot, Command } from 'yamdbf';
import { User, Message, RichEmbed } from 'discord.js';
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
			const classUrl: any = url => `https://yamdbf.js.org/${url}.html`;
			const typedefUrl: any = url => `https://yamdbf.js.org/global.html#${url}`;
			const embed: RichEmbed = new RichEmbed()
				.setColor(11854048)
				.addField('Classes:', `${(<DocBot> this.bot).docs.classes.map(a =>
					`[\`${a.name}\`](${classUrl(a.name)})`).join(', ')}`)
				.addField('Typedefs:', `${(<DocBot> this.bot).docs.typedefs.map(a =>
					`[\`${a.name}\`](${typedefUrl(a.name)})`).join(', ')}\n\n`
					+ `Use \`'docs: <class|typedef>[.property|.method]'\` for more information.`);

			return message.channel.sendEmbed(embed);
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
		if (doc.embed) return message.channel.sendEmbed(doc.embed);
		else return message.channel.sendMessage(doc.toString());
	}
}
