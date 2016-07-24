import 'isomorphic-fetch';
import parse from 'parse-link-header';
import { normalize } from 'normalizr';

import * as Schema from './schema';

const ENDPOINT_URL = 'http://localhost:5000/api';


const getNextPageURL = (response) => {
	const linkHeader = response.headers.get('link', '');
	const links = parse(linkHeader);
	return links && links.next ? links.next.url : null;
}


export const fetchGames = (nextPageURL=null) => () => {
	const url = nextPageURL || `${ENDPOINT_URL}/games`;

	return fetch(url).then(response => {

		return response.json().then(json => ({
			payload: normalize(json, Schema.arrayOfGames),
			meta: { nextPageURL: getNextPageURL(response) }
		}));

	})
};


export const toggleOwnership = (id) => {
	for (var i=0; i<data.length; ++i) {
		const datum = data[i];

		if (datum.id === id) {
			datum.name += " [OWN]";
			return wait(400).then(() => datum);
		}
	}

	throw new Error(404);
}


export const toggleKnowledge = (id) => {
	for (var i=0; i<data.length; ++i) {
		const datum = data[i];

		if (datum.id === id) {
			datum.name += " [KNOW]";
			return wait(400).then(() => datum);
		}
	}

	throw new Error(404);
}