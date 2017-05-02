import React, { PropTypes } from 'react';
import Masonry from 'react-masonry-component';

import Game from './Game';
import FilterMessage from './FilterMessage';


const contains = (array, element) => array.indexOf(element) > -1;


const GameList = ({ games, onOwnClick, onKnowClick, ownedGameIDs, knownGameIDs, fetchGames, sortAlpha, isFiltered, isSortedAlpha }) => {

	var children = games.map(game =>
		<Game
			key={ game.id }
			onOwnClick={ () => onOwnClick(game.id) }
			onKnowClick={ () => onKnowClick(game.id) }
			own={ contains(ownedGameIDs, game.id) }
			know={ contains(knownGameIDs, game.id) }
			{ ...game }
		/>
	);

	const masonryOptions = {
		transitionDuration: 0
	};

	const getMessage = () => {
		if (isFiltered) {
			if (isSortedAlpha) {
				return (<FilterMessage fetchGames={ sortAlpha } />);
			}
			else {
				return (<FilterMessage fetchGames={ fetchGames } />);
			}
		}
	};

	return (
		<div className="container">
			{ getMessage() }
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
	ownedGameIDs: PropTypes.array.isRequired,
	knownGameIDs: PropTypes.array.isRequired,
	fetchGames: PropTypes.func.isRequired,
	sortAlpha: PropTypes.func.isRequired,
	isFiltered: PropTypes.bool.isRequired,
	isSortedAlpha: PropTypes.bool.isRequired,
};


export default GameList;