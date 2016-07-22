import React, { PropTypes } from 'react';


const Game = ({ name, img, onClick }) => (
	<div onClick={ onClick }>
		<img src={ img } />
		<p>{ name }</p>
	</div>
);

Game.PropTypes = {
	name: PropTypes.string.isRequired,
	img: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired
};


export default Game;