import React, { PropTypes } from 'react';
import Masonry from 'react-masonry-component';

import Game from './Game';


const GameList = ({ games, onGameClick }) => {

	var children = games.map(game =>
		<Game
			className="image-element-class"
			key={ game.id }
			{ ...game }
			onClick={ () => onGameClick(game.id) }
		/>
	);

	const masonryOptions = {
		transitionDuration: 0
	};

	return (
		<div className="container">
			<div className="row">
				<Masonry
					options={ masonryOptions }
				>{ children }</Masonry>
			</div>
		</div>
	);
};

GameList.propTypes = {
	games: PropTypes.array.isRequired,
	onGameClick: PropTypes.func.isRequired
};


export default GameList;