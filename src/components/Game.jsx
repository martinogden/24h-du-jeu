import React, { PropTypes } from 'react';


const Game = ({ name, img }) => (
	<div className="">
		<img src={ img } />
		<p>{ name }</p>
	</div>
);

Game.PropTypes = {
	name: PropTypes.string.isRequired,
	img: PropTypes.string.isRequired
};


export default Game;