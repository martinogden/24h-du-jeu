import React, { PropTypes } from 'react';
import { Card, CardTitle, Col, Chip, Icon } from 'react-materialize';


const pluralize = (iterable, singular, plural) => {
	const n = iterable.length;
	if (n === 0)
		return;

	const verb = n === 1 ? singular : plural;

	return (
		<span>
			<strong>{ n }</strong> { verb }
		</span>
	);
}


const randInt = (a, b) => a + parseInt((b - a) * Math.random());
const li = iter => iter.map(item => {
	const n = randInt(1, 100);
	// TODO remove dummy image
	const url = `https://randomuser.me/api/portraits/women/${n}.jpg`;
	const iconStyle = {
		verticalAlign: 'sub',
		paddingRight: '5px',
	};

	return (
		<li key={ item }>
			<img src={ url } className="circle" width="20" style={ iconStyle }/>
			{ item }
		</li>
	);
});


const Game = ({ name, img_uri, own, know, owners, knowers, onClick }) => {
	const inactive = 'grey-text text-lighten-2';
	const active = ' green-text';

	const reveal = (
		<div>
			<p className="divider" style={{ margin: '1rem 0' }}></p>
			<div className="row">
				<div className="col s6 m6">
					<strong>{ pluralize(owners, 'apporte', 'apportent') }</strong>
					<ul>{ li(owners) }</ul>
				</div>
				<div className="col s6 m6">
					<strong>{ pluralize(knowers, 'explique', 'expliquent') }</strong>
					<ul>{ li(knowers) }</ul>
				</div>
			</div>
		</div>
	);

	return (
		<div className="col s6 m4">
			<Card
				header={ <CardTitle image={ img_uri } /> }
				reveal={ reveal }
				title={ name }
			>
				<p className="brown-text text-lighten-1">{ pluralize(owners, 'apporte', 'apportent') }</p>
				<p className="brown-text text-lighten-3">{ pluralize(knowers, 'explique', 'expliquent') }</p>

				<p className="divider" style={{ margin: '1rem 0' }}></p>

				<div>
					<p className={ own ? active : inactive }>
						<Icon className="tiny">done_all</Icon>{ ' ' }
						<a key="own" onClick={ onClick } className={ own ? active : inactive }>j'apporte</a>
					</p>
					<p className={ !know ? active : inactive }>
						<Icon className="tiny">done</Icon>{ ' ' }
						<a key="know" onClick={ onClick } className={ !know ? active : inactive }>j'explique</a>
					</p>
				</div>

			</Card>
		</div>
	);
};

Game.PropTypes = {
	name: PropTypes.string.isRequired,
	img_uri: PropTypes.string.isRequired,
	own: PropTypes.bool,
	know: PropTypes.bool,
	knowers: PropTypes.array.isRequired,
	owners: PropTypes.array.isRequired,
	onClick: PropTypes.func.isRequired
};


export default Game;