'use strict';
import Property from './Property';
import Constants from '../util/Constants';
import { Collection } from 'discord.js';

/**
 * Represents a documented Typedef
 */
export default class Typedef
{
	public name: string;
	public lower: string;
	public description: string;
	public properties: Collection<string, Property>;
	public url: string;
	public string: string;

	public constructor (name: string,
						properties: Collection<string, Property>,
						description: string)
	{
		this.name = name || '';
		this.lower = name.toLowerCase();
		this.properties = properties || new Collection<string, Property>();
		this.description = description || '';
		this.url = this.url = `${Constants.endpoints.yamdbf}/global.html#${this.name}`;
		this.string = `**${name}**\n\n`
			+ `**Properties:**\n${properties.size > 0 ? properties.map(a =>
				`<${a.type}> ${a.name}\n${a.description}`).join('\n\n') : 'none\n\n'}`
			+ `**Description:**\n${description}\n\n`
			+ `**Docs:** ${this.url}`;
	}

	public toString(): string
	{
		return this.string;
	}
}
