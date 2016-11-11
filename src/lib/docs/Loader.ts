'use strict';
import { Collection, Message } from 'discord.js';
import Class from '../docs/Class';
import Method from '../docs/Method';
import Param from '../docs/Param';
import Property from '../docs/Property';
import Typedef from '../docs/Typedef';
import Constants from '../util/Constants';
import * as request from 'request-promise';
import clean from '../util/Clean';

/**
 * Handles loading documented items and storing them
 * for easy retrieval
 */
export default class Loader
{
	public classes: Collection<string, Class>;
	public methods: Collection<string, Method>;
	public properties: Collection<string, Property>;
	public typedefs: Collection<string, Typedef>;
	public all: Collection<string, any>;

	public constructor ()
	{
		this.classes = new Collection<string, Class>();
		this.methods = new Collection<string, Method>();
		this.properties = new Collection<string, Property>();
		this.typedefs = new Collection<string, Typedef>();
		this.all = new Collection<string, any>();
	}

	/**
	 * Load all documented items and add them to the
	 * appropriate collections
	 */
	public async loadDocs(message?: Message): Promise<void>
	{
		console.log('Loading docs...');
		let docs: {
			classes: any[];
			typedefs: any[];
		};

		try
		{
			docs = await request({ uri: Constants.endpoints.docs, json: true });
		}
		catch (err)
		{
			console.error('There was a problem fetching docs.');
			if (message) message.edit('There was a problem reloading the docs.')
				.then((res: Message) => res.delete(5000));
			return;
		}

		this.classes.clear();
		this.methods.clear();
		this.properties.clear();
		this.typedefs.clear();
		this.all.clear();

		for (let defClass of docs.classes)
		{
			const name: string = defClass.name;
			const description: string = clean(defClass.constructor.description);

			const parameters: Collection<string, Param> = new Collection<string, Param>();
			defClass.constructor.parameters.forEach(a =>
			{
				let param: Param = new Param(a.name, typeof a.type !== 'string'
					? a.type.map(b => clean(b)).join(' | ') : clean(a.type), clean(a.description),
					a.default, a.optional, a.nullable);
				parameters.set(a.name, param);
			});

			const properties: Collection<string, Property> = new Collection<string, Property>();
			if (defClass.properties)
			{
				defClass.properties.forEach(a =>
				{
					let property: Property = new Property(a.name, clean(a.description), name,
						a.type.names.map(b => clean(b)).join(' | '), a.access, a.virtual);
					properties.set(a.name, property);
					this.properties.set(`${name.toLowerCase()}.${a.name.toLowerCase()}`, property);
					this.all.set(`${name.toLowerCase()}.${a.name.toLowerCase()}`, property);
				});
			}

			const methods: Collection<string, Method> = new Collection<string, Method>();
			defClass.functions.forEach(a =>
			{
				let parameters: Collection<string, Param> = new Collection<string, Param>();
				a.parameters.forEach(b =>
				{
					let param: Param = new Param(b.name, typeof b.type !== 'string'
						? b.type.map(c => clean(c)).join(' | ') : clean(b.type), clean(b.description),
						b.default, b.optional, b.nullable);
					parameters.set(b.name, param);
				});
				let method: Method = new Method(a.name, parameters, clean(a.description), name, a.returns
					? typeof a.returns.type !== 'string' ? a.returns.type.map(b => clean(b)).join(' | ')
						: clean(a.returns.type) : null,
					a.examples, a.access);
				methods.set(a.name, method);
				this.methods.set(`${name.toLowerCase()}.${a.name.toLowerCase()}`, method);
				this.all.set(`${name.toLowerCase()}.${a.name.toLowerCase()}`, method);
			});

			const outClass: Class = new Class(name, description, parameters, properties, methods);
			this.classes.set(defClass.name, outClass);
			this.all.set(defClass.name.toLowerCase(), outClass);
		}

		for (let typedef of docs.typedefs)
		{
			
		}

		console.log('Docs successfully loaded.');
		if (message) message.edit('Docs successfully reloaded.')
			.then((res: Message) => res.delete(5000));
	}
}
