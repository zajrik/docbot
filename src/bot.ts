'use strict';
import * as path from 'path';
import DocBot from './lib/bot/DocBot';
const config: any = require('./config.json');

const bot: DocBot = new DocBot({
	name: 'DocBot',
	token: config.token,
	config: config,
	version: '2.0.0',
	statusText: 'Try @mention help',
	commandsDir: path.join(__dirname, 'commands'),
	disableBase: [
		'disablegroup',
		'enablegroup',
		'listgroups',
		'version',
		'setprefix',
		'ping',
		'reload',
		'help',
		'eval'
	]
})
.setDefaultSetting('prefix', '')
.removeDefaultSetting('disabledGroups');

bot.docs.loadDocs()
	.then(() => bot.start())
	// .then(() => console.log(require('util').inspect(bot.docs.classes)))
	// .then(() => console.log(bot.docs.properties.map(a => a.name)))
	// .then(() => console.log(bot.docs.methods.map(a => a.name)))
	// .then(() => console.log(bot.docs.all.get('bot.loadcommand').toString()))
	.catch(console.error);

bot.on('ready', () => console.log('\u0007'));
