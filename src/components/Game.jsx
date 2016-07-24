import React, { PropTypes } from 'react';
import { Card, CardTitle, Col } from 'react-materialize';


const Game = ({ name, img_uri, own, know, onClick }) => {
	const actions = [
		<a key="own" onClick={ onClick } className={ own ? 'grey-text' : '' }>Own</a>,
		<a key="know" onClick={ onClick } className={ know ? 'grey-text' : '' }>Know</a>
	];


	return (
		<div className="col s6 m3">
			<Card
				title={ name }
				header={<CardTitle image={ img_uri } />}
				actions={ actions }
			/>
		</div>
	);
};

Game.PropTypes = {
	name: PropTypes.string.isRequired,
	img_uri: PropTypes.string.isRequired,
	own: PropTypes.bool,
	know: PropTypes.bool,
	onClick: PropTypes.func.isRequired
};


export default Game;