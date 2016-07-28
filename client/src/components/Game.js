import React, { PropTypes } from 'react';
import { Card, CardTitle, Icon } from 'react-materialize';


const pluralize = (iterable, singular, plural) => {
	const n = iterable.length;
	const verb = n === 1 ? singular : plural;

	return (
		<span>
			<strong>{ n }</strong> { verb }
		</span>
	);
}


const randInt = (a, b) => a + parseInt((b - a) * Math.random(), 10);
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
	const inactive = 'inactive grey-text text-lighten-2';
	const active = 'active green-text';

	const reveal = (
		<div>
			<p className="divider" style={{ margin: '1rem 0' }}></p>
			<div className="row">
				<div className="col s6 m6">
					<strong>{ pluralize(owners, 'apporte', 'apportent') }</strong>
					<ul className="owner-list">{ li(owners) }</ul>
				</div>
				<div className="col s6 m6">
					<strong>{ pluralize(knowers, 'explique', 'expliquent') }</strong>
					<ul className="knower-list">{ li(knowers) }</ul>
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
				<p className="owner-count brown-text text-lighten-1">{ pluralize(owners, 'apporte', 'apportent') }</p>
				<p className="knower-count brown-text text-lighten-3">{ pluralize(knowers, 'explique', 'expliquent') }</p>

				<p className="divider" style={{ margin: '1rem 0' }}></p>

				<div>
					<p className={ `toggle-own ${own ? active : inactive}` } onClick={ onClick }>
						<Icon className="tiny">done_all</Icon>{ ' ' }
						<a key="own" className={ own ? active : inactive }>j'apporte</a>
					</p>
					<p className={ `toggle-know ${know ? active : inactive}` } onClick={ onClick }>
						<Icon className="tiny">done</Icon>{ ' ' }
						<a key="know" className={ know ? active : inactive }>j'explique</a>
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