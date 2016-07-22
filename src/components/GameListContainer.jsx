import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';
import { getGames, getIsFetching } from '../reducers';
import GameList from './GameList.jsx';


class GameListContainer extends React.Component {

	componentDidMount() {
		this.fetch();
	}

	fetch() {
		this.props.fetchGames();
	}

	render() {
		const { games, isFetching, toggleGameOwnership } = this.props;

		if (isFetching) {
			return (<p>Loading...</p>);
		}

		return (
			<GameList games={ games } onGameClick={ toggleGameOwnership } />
		);
	}
}

GameListContainer.propTypes = {
	games: PropTypes.array.isRequired,
	isFetching: PropTypes.bool.isRequired,
	fetchGames: PropTypes.func.isRequired,
	toggleGameOwnership: PropTypes.func.isRequired,
	toggleGameKnowledge: PropTypes.func.isRequired
};


const mapStateToProps = (state) => ({
	games: getGames(state),
	isFetching: getIsFetching(state)
});

GameListContainer = connect(mapStateToProps, actions)(GameListContainer);


export default GameListContainer;