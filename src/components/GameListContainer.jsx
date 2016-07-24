import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Waypoint from 'react-waypoint';

import * as actions from '../actions';
import { getGames, getIsFetching } from '../reducers';
import GameList from './GameList.jsx';

class GameListContainer extends React.Component {

	getWaypoint() {
		const { isFetching, fetchNextGames } = this.props;
		if (!isFetching) {
			return (
				<Waypoint
					onEnter={ fetchNextGames }
					bottomOffset={ -20 }
				/>
			);
		}
	}

	render() {
		const { games, toggleGameOwnership } = this.props;

		return (
			<div>
				<GameList
					games={ games }
					onGameClick={ toggleGameOwnership }
				/>
				{ this.getWaypoint() }
			</div>
		);
	}
}

GameListContainer.propTypes = {
	games: PropTypes.array.isRequired,
	isFetching: PropTypes.bool.isRequired,
	fetchNextGames: PropTypes.func.isRequired,
	toggleGameOwnership: PropTypes.func.isRequired,
	toggleGameKnowledge: PropTypes.func.isRequired
};


const mapStateToProps = (state) => ({
	games: getGames(state),
	isFetching: getIsFetching(state)
});

GameListContainer = connect(mapStateToProps, actions)(GameListContainer);


export default GameListContainer;