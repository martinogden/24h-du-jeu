import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Waypoint from 'react-waypoint';
import { Preloader } from 'react-materialize';

import * as actions from '../actions/games';
import { getGames, getOwnedGameIDs, getKnownGameIDs, getBggGames } from '../reducers';
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
				<div className="row">
				  <div className="col m4 offset-m4 center s4 offset-s4">
				    <Preloader size="big" flashing/>
				  </div>
				</div>
			);
		}
	}

	render() {
		const props = this.props;

		return (
			<div>
				<AddGame onSearch={ props.fetchBGGGames } autocomplete={ props.bggGames }/>
				<GameList
					games= { props.games }
					onOwnClick={ props.toggleGameOwnership }
					onKnowClick={ props.toggleGameKnowledge }
					ownedGameIDs={ props.ownedGameIDs }
					knownGameIDs={ props.knownGameIDs }
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
	bggGames: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => ({
	games: getGames(state),
	ownedGameIDs: getOwnedGameIDs(state),
	knownGameIDs: getKnownGameIDs(state),
	isFetching: state.games.isFetching,
	bggGames: getBggGames(state),
});

export default connect(mapStateToProps, actions)(GameListContainer);
