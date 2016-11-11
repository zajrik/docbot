'use strict';
import Param from './Param';
import Constants from '../util/Constants';
import { Collection } from 'discord.js';

/**
 * Represents a documented method of a parent class
 */
export default class Method
{
	public name: string;
	public lower: string;
	public parameters: Collection<string, Param>;
	public description: string;
	public memberOf: string;
	public returns: string;
	public example: string;
	public access: string;
	public url: string;
	public string: string;

	public constructor (name: string,
						parameters: Collection<string, Param>,
						description: string,
						memberOf: string,
						returns?: string,
						example?: string,
						access?: string)
	{
		this.name = name || '';
		this.lower = name.toLowerCase();
		this.parameters = parameters || new Collection<string, Param>();
		this.description = description || '';
		this.memberOf = memberOf || '';
		this.returns = returns || 'void';
		this.example = example || '';
		this.access = access || '';
		this.url = this.url = `${Constants.endpoints.yamdbf}/${memberOf}.html#${name}`;
		this.string = `\`${memberOf}.${name}(${parameters.map(a => a.name).join(', ')})\`\n\n`
			+ `${parameters.map(a => a.toString()).join('\n')}`
			+ `${parameters.size > 0 ? '\n' : ''}${description}\n\n`
			+ `${returns ? `**returns:** \`${returns}\`\n\n` : ''}`
			+ `**Docs:** ${this.url}`;
	}

	public toString(): string
	{
		return this.string;
	}
}
