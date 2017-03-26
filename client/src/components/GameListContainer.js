import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Waypoint from 'react-waypoint';
import { Preloader } from 'react-materialize';

import * as actions from '../actions/games';
import { getGames, getOwnedGameIDs, getKnownGameIDs, getBggGames, getBggGameDetailedLatest } from '../reducers';
import GameList from './GameList';
import AddGame from './AddGame';


export class GameListContainer extends React.Component {

	componentDidMount() {
		this.props.fetchGames();
	}

	getWaypoint() {
		const { isFetching, paginateGames } = this.props;
		if (!isFetching) {
			return (				
				<Waypoint
					onEnter={ paginateGames }
					bottomOffset={ -20 }
				/>
			);
		}
	}

	getLoader() {
		const { isFetching } = this.props;
		if (isFetching) {
			return (
				<div style={{ position: 'fixed', top: 0, left: 0, background: 'rgba(255, 255, 255, 0.8)', width: '100%', height: '100%', textAlign: 'center', zIndex: 100 }}>
					<div style={{ margin: '240px auto' }}>
						<Preloader style={{ display: 'block', margin: '50px auto' }} size="big" flashing/>
					</div>
				</div>
			);
		}
	}

	render() {
		const props = this.props;

		return (
			<div>
				<AddGame onSearch={ props.fetchBGGGames } onSelect={ props.fetchBGGGame } autocomplete={ props.bggGames } bggGame={ props.bggGame }/>
				<GameList
					games= { props.games }
					onOwnClick={ props.toggleGameOwnership }
					onKnowClick={ props.toggleGameKnowledge }
					ownedGameIDs={ props.ownedGameIDs }
					knownGameIDs={ props.knownGameIDs }
					fetchGames={ props.fetchGames }
					isFiltered={ props.isFiltered }
				/>
				{ this.getWaypoint() }
				{ this.getLoader() }
			</div>
		);
	}
}

GameListContainer.propTypes = {
	games: PropTypes.array.isRequired,
	isFetching: PropTypes.bool.isRequired,
	fetchGames: PropTypes.func.isRequired,
	paginateGames: PropTypes.func.isRequired,
	toggleGameOwnership: PropTypes.func.isRequired,
	toggleGameKnowledge: PropTypes.func.isRequired,
	ownedGameIDs: PropTypes.array.isRequired,
	knownGameIDs: PropTypes.array.isRequired,
	fetchBGGGames: PropTypes.func.isRequired,
	fetchBGGGame: PropTypes.func.isRequired,
	bggGames: PropTypes.func.isRequired,
	isFiltered: PropTypes.bool.isRequired,
};


const mapStateToProps = (state) => ({
	games: getGames(state),
	ownedGameIDs: getOwnedGameIDs(state),
	knownGameIDs: getKnownGameIDs(state),
	isFetching: state.games.isFetching,
	isFiltered: state.games.isFiltered,
	bggGames: getBggGames(state),
	bggGame: getBggGameDetailedLatest(state),
});

export default connect(mapStateToProps, actions)(GameListContainer);
