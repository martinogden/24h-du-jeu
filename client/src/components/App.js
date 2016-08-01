import React, { PropTypes } from 'react';
import { Provider, connect } from 'react-redux';

import * as gameActions from '../actions/games';
import * as authActions from '../actions/auth';
import Login from './Login';
import Navbar from './Navbar';
import GameListContainer from './GameListContainer';


export class App extends React.Component {

	render() {
		const { store, isLoggedIn, authWithFacebook } = this.props;

		if (!isLoggedIn)
			return <Login success={ authWithFacebook }/>;

		return (
			<div>
				<Navbar/>
				<Provider store={ store }>
					<GameListContainer />
				</Provider>
			</div>
		);
	}
};

App.PropTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
	store: PropTypes.object.isRequired
};


const mapStateToProps = (state) => ({
	isLoggedIn: state.auth.isLoggedIn,
});

const actions = {
	...gameActions,
	...authActions,
};

export default connect(mapStateToProps, actions)(App);
