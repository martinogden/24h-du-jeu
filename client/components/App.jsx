import React, { PropTypes } from 'react';
import { Provider, connect } from 'react-redux';
import FacebookLogin from 'react-facebook-login';
import { Card, Navbar, NavItem, Icon } from 'react-materialize';

import * as actions from '../actions';
import GameListContainer from './GameListContainer.jsx';


const FACEBOOK_STAUS_NOT_AUTHORIZED = 'not_authorized';
const FACEBOOK_STAUS_UNKNOWN = 'unknown';


class App extends React.Component {

	renderLogin() {
		const { authWithFacebook } = this.props;
		const callback = (response) => {
			if (response.status)  // todo both failure states
				return;

			authWithFacebook(response);  // we're connected
		}

		const centerStyles = {
			position: "absolute",
			top: "50%",
			left: "50%",
			transform: "translate(-50%, -50%)",
			textAlign: "center"
		};

		const fbLoginButton = (
			<FacebookLogin
				key="fb_login"
				size="small"
				appId="322217561499723"
				autoLoad={ true }
				fields="name,email,picture"
				icon="fa-facebook"
				callback={ callback }
			/>
		);

		return (
			<div style={ centerStyles }>
				<Card className={ "brown lighten-5" }
					title="Bienvenue aux 24h du Jeu !"
					actions={ [fbLoginButton] }>
				</Card>
			</div>
		);
	}

	renderContent() {
		return (
			<div>
				<div className="navbar-fixed">
					<Navbar brand='&nbsp;24h du Jeu' right>
						<NavItem href='#'><Icon>search</Icon></NavItem>
					</Navbar>
				</div>

				<Provider store={ this.props.store }>
					<GameListContainer />
				</Provider>
			</div>
		);
	}

	render() {
		const { isLoggedIn } = this.props;

		if (!isLoggedIn)
			return this.renderLogin();

		return this.renderContent();
	}
};

App.PropTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
	store: PropTypes.object.isRequired
};


const mapStateToProps = (state) => ({
	isLoggedIn: state.isLoggedIn
});

App = connect(mapStateToProps, actions)(App);

export default App;