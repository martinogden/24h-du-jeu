import React, { PropTypes } from 'react';
import { Provider, connect } from 'react-redux';

import * as gameActions from '../actions/games';
import { getLoggedInUser } from '../reducers';
import * as authActions from '../actions/auth';

import Login from './Login';
import Navbar from './Navbar';
import GameListContainer from './GameListContainer';


export class App extends React.Component {

	onLogout() {
		const { logoutFromFacebook } = this.props;
		FB.logout(logoutFromFacebook);
	}

	render() {
		const { store, isLoggedIn, failedLogIn, authWithFacebook, filterGames, logoutFromFacebook, sortAlpha, isFiltered, isSortedAlpha, fetchGames, fetchGamesIKnow, fetchGamesIOwn, loggedInUser } = this.props;

		if (!isLoggedIn)
			return <Login failedLogIn={ failedLogIn } success={ authWithFacebook }/>;

		return (
			<div>
				<Navbar 
					loggedInUser={ loggedInUser }
					onSearch={ filterGames } 
					onLogout={ logoutFromFacebook } 
					onSortAlpha={ sortAlpha }
					isFiltered={ isFiltered }
					isSortedAlpha={ isSortedAlpha }
					onFetchGames={ fetchGames }
					onFetchGamesIKnow={ fetchGamesIKnow } 
					onFetchGamesIOwn={ fetchGamesIOwn }/>
				<Provider store={ store }>
					<GameListContainer />
				</Provider>
			</div>
		);
	}
}

App.PropTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
	failedLogIn: PropTypes.bool.isRequired,
	store: PropTypes.object.isRequired,
	loggedInUser: PropTypes.object.isRequired,
	authWithFacebook: PropTypes.func.isRequired,
	filterGames: PropTypes.func.isRequired,
	fetchGamesIKnow: PropTypes.func.isRequired,
	fetchGamesIOwn: PropTypes.func.isRequired,
	fetchGames: PropTypes.func.isRequired,
	sortAlpha: PropTypes.func.isRequired,
	isSortedAlpha: PropTypes.bool.isRequired,
	isFiltered: PropTypes.bool.isRequired,
};


const mapStateToProps = (state) => ({
	isLoggedIn: state.auth.isLoggedIn,
	failedLogIn: state.auth.failedLogIn,
	loggedInUser: getLoggedInUser(state),
	isSortedAlpha: state.games.isSortedAlpha,
	isFiltered: state.games.isFiltered,
});

const actions = {
	...gameActions,
	...authActions,
};

export default connect(mapStateToProps, actions)(App);