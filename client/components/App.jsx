import React, { PropTypes } from 'react';
import { Provider, connect } from 'react-redux';

import * as actions from '../actions/auth';
import Login from './Login.jsx';
import Navbar from './Navbar.jsx';
import GameListContainer from './GameListContainer.jsx';


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

export default connect(mapStateToProps, actions)(App);
