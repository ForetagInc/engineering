import { get } from 'request-promise';
import { decidePath, parseVersions } from './index-utils';

const API = 'https://api.github.com/repos/rust-lang/crates.io-index';

const data: any = {};

function cache(key: string, func: any, url: string, githubToken?: string) {

	if (!data[key] || data[key].isRejected()) {
		console.log('Fetching dependency: ', key);
		const headers: { [key: string]: string; } = {
			'User-Agent':
				'VSCode.Crates (https://marketplace.visualstudio.com/items?itemName=serayuzgur.crates)',
			Accept: 'application/vnd.github.VERSION.raw',
		};
		if (githubToken) {
			headers.Authorization = githubToken;
		}
		data[key] = func(url, {
			headers
		})
			.then((response: string) => parseVersions(response, key))
			.catch((resp: any) => {
				console.error(resp);
				throw resp;
			});
	}
	return data[key];
}

export const versions = (name: string, githubToken?: string) => {
	return cache(name, get, `${API}/contents/${decidePath(name)}`, githubToken);
};