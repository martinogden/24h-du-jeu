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


const li = iter => iter.map(item => {
	const iconStyle = {
		verticalAlign: 'sub',
		paddingRight: '5px',
	};

	/* Display icon if user doesn't have a picture */
	const user_image = () => {
	if (!item.picture_url)
		return (<i className="material-icons tiny">person</i>);
	else
		return (<img src={ item.picture_url } className="circle" width="20" style={ iconStyle }/>);
	}

	return (
		<li key={ item.id }>
			{ user_image() }
			{ item.pseudo }
		</li>
	);
});


const Game = ({ name, img_uri, own, know, owners, knowers, onOwnClick, onKnowClick }) => {
	const inactive = 'inactive grey-text text-lighten-2';
	const active = 'active teal-text';

	const reveal = (
		<div>
			<span className="card-title grey-text text-darken-4">
				{ name }
			</span>

			<p className="divider" style={{ margin: '1rem 0' }}></p>
			<div className="row">
				<div className="col s6 m6">
					<strong>{ pluralize(owners, 'possède', 'possèdent') }</strong>
					<ul className="owner-list">{ li(owners) }</ul>
				</div>
				<div className="col s6 m6">
					<strong>{ pluralize(knowers, 'explique', 'expliquent') }</strong>
					<ul className="knower-list">{ li(knowers) }</ul>
				</div>
			</div>
		</div>
	);

	const Header = () => (
		<div className="card-image" onDoubleClick={ onKnowClick }>
			<img src={ img_uri } />
		</div>
	);

	return (
		<div className="col s6 m3">
			<Card header={ <Header/> } reveal={ reveal }>

				<span className="card-title grey-text text-darken-4 activator">
					{ name }
					<i className="material-icons right">group</i>
				</span>

				<div>
					<p className={ `toggle-own ${own ? active : inactive}` }>
						<Icon className="tiny">done</Icon>{ ' ' }
						<a href="#" key="own" className={ own ? active : inactive } onClick={ (e) => { onOwnClick(); e.preventDefault() }}>je possède</a>
					</p>
					<p className={ `toggle-know ${know ? active : inactive}` }>
						<Icon className="tiny">done_all</Icon>{ ' ' }
						<a href="#" key="know" className={ know ? active : inactive }  onClick={ (e) => { onKnowClick(); e.preventDefault() }}>j&#39;explique</a>
					</p>
				</div>

			</Card>
		</div>
	);
};


Game.PropTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	img_uri: PropTypes.string.isRequired,
	own: PropTypes.bool,
	know: PropTypes.bool,
	knowers: PropTypes.array.isRequired,
	owners: PropTypes.array.isRequired,
	onClick: PropTypes.func.isRequired
};


export default Game;