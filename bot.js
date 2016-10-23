const Bot = require('yamdbf').Bot;
const config = require('./config.json');
const path = require('path');
const DocsLoader = require('./lib/DocsLoader').default;

const bot = new Bot({
	name: 'YAMDBF Docs',
	token: config.token,
	config: config,
	selfbot: false,
	version: '1.0.0',
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

bot.docsLoader = new DocsLoader();
bot.docsLoader.loadDocs().then(() => bot.start());
