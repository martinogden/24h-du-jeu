import React, { PropTypes } from 'react';
import Masonry from 'react-masonry-component';

import GameTile from './GameTile';
import GameLine from './GameLine';
import FilterMessage from './FilterMessage';


const contains = (array, element) => array.indexOf(element) > -1;


const GameList = ({ games, onOwnClick, onKnowClick, ownedGameIDs, knownGameIDs, fetchGames, sortAlpha, isFiltered, isSortedAlpha, isTileDisplay }) => {

	var childrenTile = games.map(game =>
		<GameTile
			key={ game.id }
			onOwnClick={ () => onOwnClick(game.id) }
			onKnowClick={ () => onKnowClick(game.id) }
			own={ contains(ownedGameIDs, game.id) }
			know={ contains(knownGameIDs, game.id) }
			{ ...game }
		/>
	);

	var childrenLine = games.map(game =>
		<GameLine
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

	const displayContent = (isTileDisplay) => {
		if (isTileDisplay) {
			return(
				<div className="container">
					{ getMessage() }
					<div className="row">
						<Masonry
							options={ masonryOptions }
						>{ childrenTile }</Masonry>
					</div>
				</div>
			);
		} else {
			return(
				<div className="container">
					{ getMessage() }
					<table className='bordered highlight responsive-table'>
						<tbody>{ childrenLine }</tbody>
					</table>
				</div>
			);
		};

	};

	return (
		<div>{ displayContent(isTileDisplay) }</div>
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
	isTileDisplay: PropTypes.bool.isRequired,
};


export default GameList;