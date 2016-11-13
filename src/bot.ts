'use strict';
import * as path from 'path';
import { Command } from 'yamdbf';
import DocBot from './lib/bot/DocBot';
const config: any = require('./config.json');

const bot: DocBot = new DocBot({
	name: 'YAMDBF Docs',
	token: config.token,
	config: config,
	version: '2.0.0',
	statusText: 'docs: help',
	commandsDir: path.join(__dirname, 'commands'),
	disableBase: [
		'disablegroup',
		'enablegroup',
		'listgroups',
		'version',
		'setprefix',
		'ping',
		'reload',
		'help'
	]
})
.setDefaultSetting('prefix', '')
.removeDefaultSetting('disabledGroups');

const evalCommand: Command = bot.commands.get('eval');
bot.commands.delete('eval');
evalCommand.name = 'docs:eval';
bot.commands.set('docs:eval', evalCommand);

bot.docs.loadDocs()
	.then(() => bot.start())
	.catch(console.error);

bot.on('ready', () => console.log('\u0007'));
