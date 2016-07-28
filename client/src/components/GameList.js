import React, { PropTypes } from 'react';
import Masonry from 'react-masonry-component';

import Game from './Game';


const GameList = ({ games, onOwnClick, onKnowClick }) => {

	var children = games.map(game =>
		<Game
			className="image-element-class"
			key={ game.id }
			onOwnClick={ () => onOwnClick(game.id) }
			onKnowClick={ () => onKnowClick(game.id) }
			{ ...game }
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
	onOwnClick: PropTypes.func.isRequired,
	onKnowClick: PropTypes.func.isRequired,
};


export default GameList;