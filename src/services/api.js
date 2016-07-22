/* TODO replace with proper API call */
var rawData = localStorage.getItem('games');

if (!rawData)
  throw new Error("No game data in local storage.");

const data = JSON.parse(rawData);

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));


export const fetchGames = () => {
  return wait(400).then(() => data)
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