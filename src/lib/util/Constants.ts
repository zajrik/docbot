'use strict';

type Endpoints = {
	docs: string;
	yamdbf: string;
}

type BotConstants = {
	endpoints?: Endpoints;
}

const Constants: BotConstants = <any> {}; // tslint:disable-line
Constants.endpoints = {
	docs: 'https://yamdbf.js.org/docs.json',
	yamdbf: 'https://yamdbf.js.org'
};
export default Constants;
