import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Waypoint from 'react-waypoint';
import { Preloader } from 'react-materialize';

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

	getLoader() {
		return (
			<div className="row">
			  <div className="col m4 offset-m4 center">
			    <Preloader size="big" flashing/>
			  </div>
			</div>
		);
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
				{ this.getLoader() }
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