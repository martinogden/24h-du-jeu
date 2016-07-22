import React, { PropTypes } from 'react';
import Game from './Game.jsx';


const GameList = ({ games, onGameClick }) => {

	var children = games.map(game =>
		<Game
			key={ game.id }
			{ ...game }
			onClick={ () => onGameClick(game.id) }
		/>
	);

	return (
		<div className="row">{ children }</div>
	);
};

GameList.propTypes = {
	games: PropTypes.array.isRequired,
	onGameClick: PropTypes.func.isRequired
};


export default GameList;