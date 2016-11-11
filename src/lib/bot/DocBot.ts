'use strict';
import { Bot, BotOptions } from 'yamdbf';
import { ClientOptions } from 'discord.js';
import Loader from '../docs/Loader';


/**
 * Extend Bot class to allow for extra properties and
 * necessary method extensions 
 */
export default class Docbot extends Bot
{
	public docs: Loader;

	public constructor(botOptions: BotOptions, clientOptions?: ClientOptions)
	{
		super(botOptions, clientOptions);
		this.docs = new Loader();
	}
}
