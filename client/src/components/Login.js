import React, { PropTypes } from 'react';
import FacebookLogin from 'react-facebook-login';
import {  Button, Input } from 'react-materialize';
import { FACEBOOK_PARAMS } from '../constants';


// todo move to stylesheet
const centerStyles = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	textAlign: 'center'
};


const Login = ({ failedLogIn, success, onDjangoLogin }) => {

	const callback = (response) => {
		console.log(response);
		if (!response.status)  // todo both failure states
			success(response);  // we're connected
	};

	const failedLogInMessage = (failedLogIn) => {
		if (failedLogIn)
			return(
				<span className="red-text">Vous n&#39;êtes pas autorisé.</span>
			);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		var fd = new FormData(e.target);
		console.log(fd);
		onDjangoLogin(fd);
	};

	const fb = <FacebookLogin callback={ callback } { ...FACEBOOK_PARAMS } />;

	return (
		<div style={ centerStyles }>
			{ failedLogInMessage(failedLogIn) }
			<div className="card">
				<div className="card-content">
					<span className="card-title responsive-img"><img src="/static/img/logo-login.png"/></span>
					<div className="card-title grey-text text-darken-4">Bienvenue aux 24h du Jeu !</div>
				</div>
				<div className="card-content grey lighten-4">
					<div id="django" className="section">
					<form method="post" onSubmit={ handleSubmit } action="http://localhost:8000/api/games/django-login/">
						<div>
							<Input name="username" label="Nom d'utilisateur" type="text" />
						</div>
						<div>
							<Input name="password" label="Mot de passe" type="password" />
						</div>
						<div>
							<Button waves="light" type="submit" >Se connecter</Button>
						</div>
					</form>
					</div>
					<div className="section">OU</div>					
					<div id="facebook" className="section">{[fb]}</div>
				</div>
				
			</div>
		</div>
	);
};

Login.PropTypes = {
	success: PropTypes.func.isRequired,
	failedLogIn: PropTypes.bool.isRequired,
	onDjangoLogin: PropTypes.func.isRequired,
};


export default Login;