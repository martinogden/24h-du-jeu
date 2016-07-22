import React, { PropTypes } from 'react';
import Game from './Game.jsx';


const GameList = ({ games }) => {

	var children = games.map(
		game => <Game key={ game.id } { ...game } />
	);

	return (
		<div>{ children }</div>
	);
};

GameList.propTypes = {
	games: PropTypes.array.isRequired
};


export default GameList;