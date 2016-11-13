import React, { PropTypes } from 'react';
import FacebookLogin from 'react-facebook-login';
import { Card, CardTitle } from 'react-materialize';


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
	textButton: 'Connexion avec Facebook',
};


const Login = ({ failedLogIn, success }) => {

	const callback = (response) => {
		if (!response.status)  // todo both failure states
			success(response);  // we're connected
	};

	const failedLogInMessage = (failedLogIn) => {
		if (failedLogIn)
			return(
				<span className="red-text">Vous n&#39;êtes pas authorisé.</span>
			);
	};

	return (
		<div style={ centerStyles }>
			{ failedLogInMessage(failedLogIn) }
			<Card className="brown lighten-5"
				header={<CardTitle image={"/static/img/logo-login.png"} className="responsive-img"/>}
				title="Bienvenue aux 24h du Jeu !"
				actions={ [<FacebookLogin callback={ callback } { ...fb_props } />] }>
			</Card>
		</div>
	);
};

Login.PropTypes = {
	success: PropTypes.func.isRequired,
	failedLogIn: PropTypes.bool.isRequired,
};


export default Login;