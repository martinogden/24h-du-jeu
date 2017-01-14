import React, { PropTypes } from 'react';
import FacebookLogin from 'react-facebook-login';
import { Card, CardTitle } from 'react-materialize';
import { FACEBOOK_PARAMS } from '../constants';


// todo move to stylesheet
const centerStyles = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	textAlign: 'center'
};


const Login = ({ failedLogIn, success }) => {

	const callback = (response) => {
		console.log(response);
		if (!response.status)  // todo both failure states
			success(response);  // we're connected
	};

	const failedLogInMessage = (failedLogIn) => {
		if (failedLogIn)
			return(
				<span className="red-text">Vous n&#39;êtes pas authorisé.</span>
			);
	};

	const fb = <FacebookLogin callback={ callback } { ...FACEBOOK_PARAMS } />;

	return (
		<div style={ centerStyles }>
			{ failedLogInMessage(failedLogIn) }
			<Card className="brown lighten-5"
				header={<CardTitle image={"/static/img/logo-login.png"} className="responsive-img"/>}
				title="Bienvenue aux 24h du Jeu !"
				actions={ [fb] }>
			</Card>
		</div>
	);
};

Login.PropTypes = {
	success: PropTypes.func.isRequired,
	failedLogIn: PropTypes.bool.isRequired,
};


export default Login;