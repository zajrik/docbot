'use strict';
import Constants from '../util/Constants';

/**
 * Represents a documented property of a parent class
 */
export default class Property
{
	public name: string;
	public lower: string;
	public description: string;
	public memberOf: string;
	public access?: string;
	public virtual?: boolean;
	public type: string;
	public url: string;
	public string: string;

	public constructor (name: string,
						description: string,
						memberOf: string,
						type: string,
						access?: string,
						virtual?: boolean)
	{
		this.name = name || '';
		this.lower = name.toLowerCase();
		this.memberOf = memberOf;
		this.description = description || '';
		this.type = type || '';
		this.access = access || '';
		this.virtual = virtual || false;
		this.url = this.url = `${Constants.endpoints.yamdbf}/${this.memberOf}.html#${this.name}`;
		this.string = `\`${this.memberOf}.${this.name}\`\n\n${this.description}\n\n`
			+ `**type:** \`${this.type}\`\n\n**Docs:** ${this.url}`;
	}

	public toString(): string
	{
		return this.string;
	}
}
