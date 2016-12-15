'use strict';

/**
 * Prune unecessary text, format certain tags
 */
export default function clean(text: string): string
{
	return text
			.replace(/#/g, '.')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/external:/g, '')
			.replace(/\[[^\]]+\]/g, '')
			.replace(/(.+)\.(<.+>)/g, '$1$2')
			.replace(/\{@link ([^\}]+)\}/g, '`$1`')
			.replace(/<code>|<\/code>/g, '`');
}
