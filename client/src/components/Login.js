import React, { PropTypes } from 'react';
import FacebookLogin from 'react-facebook-login';
import { Card, Navbar, NavItem, Icon } from 'react-materialize';


const FACEBOOK_STAUS_NOT_AUTHORIZED = 'not_authorized';
const FACEBOOK_STAUS_UNKNOWN = 'unknown';

// todo move to stylesheet
const centerStyles = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	textAlign: 'center'
};

// todo move to config file
const fb_props = {
	key: 'fb_login',
	size: 'small',
	appId: '322217561499723',
	autoLoad: true,
	fields: 'name,email,picture',
	icon: 'fa-facebook',
};


const Login = ({ success }) => {

	const callback = (response) => {
		if (!response.status)  // todo both failure states
			success(response);  // we're connected
	}

	return (
		<div style={ centerStyles }>
			<Card className="brown lighten-5"
				title="Bienvenue aux 24h du Jeu !"
				actions={ [<FacebookLogin callback={ callback } { ...fb_props } />] }>
			</Card>
		</div>
	);
};

Login.PropTypes = {
	success: PropTypes.func.isRequired,
};


export default Login;