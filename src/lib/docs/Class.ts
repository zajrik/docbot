'use strict';
import Param from './Param';
import Property from './Property';
import Method from './Method';
import Constants from '../util/Constants';
import { Collection, RichEmbed } from 'discord.js';

/**
 * Represents a documented class
 */
export default class Class
{
	public name: string;
	public lower: string;
	public description: string;
	public parameters: Collection<string, Param>;
	public properties: Collection<string, Property>;
	public methods: Collection<string, Method>;
	public url: string;
	public string: string;
	public embed: RichEmbed;

	public constructor (name: string,
						description: string,
						parameters?: Collection<string, Param>,
						properties?: Collection<string, Property>,
						methods?: Collection<string, Method>)
	{
		this.name = name || '';
		this.lower = name.toLowerCase();
		this.description = description || '';
		this.parameters = parameters || new Collection<string, Param>();
		this.properties = properties || new Collection<string, Property>();
		this.methods = methods || new Collection<string, Method>();
		this.url = `${Constants.endpoints.yamdbf}/${this.name}.html`;
		this.string = `**${name}:** \`new ${name}(${parameters.map(a => a.name).join(', ')})\`\n\n`
			+ `**Params**:\n${parameters.size > 0 ? parameters.map(a =>
				a.toString()).join('\n') + '\n' : 'none\n\n'}`
			+ `**Description**:\n${description}\n\n`
			+ `${properties.size > 0 ? `**Properties:**\n\`${properties.map(a =>
				a.name).join('`, `')}\`\n\n` : ''}`
			+ `${methods.size > 0 ? `**Methods:**\n\`${methods.map(a =>
				`${a.name}()`).join('`, `')}\`\n\n` : ''}`
			+ `**Docs:** ${this.url}\n\n`
			+ `Use \`docs: ${name}.<property|method>\` for more information`;

		this.embed = new RichEmbed()
			.setColor(11854048)
			.setDescription(`**${name}:** \`new ${name}(${parameters.map(a => a.name).join(', ')})\``)
			.addField('Parameters', `${parameters.size > 0 ? parameters.map(a =>
				a.toString()).join('\n') + '\n' : 'none'}`)
			.addField('Description', description);

		if (properties.size > 0) this.embed.addField('Properties', `${properties.map(a =>
				`[\`${a.name}\`](${this.url}#${a.name})`).join(', ')}`);

		if (methods.size > 0) this.embed.addField('Methods', `${methods.map(a =>
				`[\`${a.name}()\`](${this.url}#${a.name})`).join(', ')}`);

		this.embed
			.addField('Docs link', `${this.url}\n\nUse \`docs: ${name}.<property|method>\` for more information`);
	}

	public toString(): string
	{
		return this.string;
	}
}
