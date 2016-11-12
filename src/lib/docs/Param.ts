'use strict';


/**
 * Represents a documented parameter of a class or method
 */
export default class Param
{
	public name: string;
	public lower: string;
	public type: string;
	public description: string;
	public defaultValue: string;
	public optional: boolean;
	public nullable: any;
	public string: string;

	public constructor (name: string,
						type: string,
						description: string,
						defaultValue?: string,
						optional?: any,
						nullable?: any)
	{
		this.name = name || '';
		this.lower = name.toLowerCase();
		this.type = type || '';
		this.description = description || '';
		this.defaultValue = defaultValue || '';
		this.optional = optional || false;
		this.nullable = nullable || '';
		this.string = `\`<${type}> ${name}${defaultValue ? ` = ${defaultValue}` : ''}${optional ? ` (optional)` : ''}\`\n${description}\n`;
	}

	public toString(): string
	{
		return this.string;
	}
}
