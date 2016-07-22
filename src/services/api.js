/* TODO replace with proper API call */
var rawData = localStorage.getItem('games');

if (!rawData)
  throw new Error("No game data in local storage.");

const response = JSON.parse(rawData);

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));


export const fetchGames = () => {
  return wait(1000).then(() => response)
};