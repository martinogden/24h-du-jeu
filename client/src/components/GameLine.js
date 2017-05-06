import React, { PropTypes } from 'react';
import { Icon } from 'react-materialize';


const pluralize = (iterable, singular, plural) => {
	const n = iterable.length;
	const verb = (n === 0 || n === 1) ? singular : plural;

	return (
		<span>
			<strong>{ n }</strong> { verb }
		</span>
	);
};


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


const GameLine = ({ name, img_uri, img_ratio, type_genre, own, know, owners, knowers, onOwnClick, onKnowClick }) => {
	const inactive = 'inactive grey-text text-lighten-2';
	const active = 'active teal-text';

	const reveal = (
		<div>

		</div>
	);

	// https://www.perpetual-beta.org/weblog/responsive-images-without-browser-reflow.html
	const Header = () => (
		<div >
		</div>
	);

	const knowText = () => {
		if (own) 
			return(<span><Icon className="tiny">done_all</Icon>{ ' ' }J&#39;EXPLIQUE</span>)
		else
			return(<a href="#" key="know" className={ know ? active : inactive }  onClick={ (e) => { onKnowClick(); e.preventDefault() }}><Icon className="tiny">done_all</Icon>{ ' ' }J&#39;EXPLIQUE</a>)
	};

	const ownAction = (
		<span className={ `toggle-own ${own ? active : inactive}`  } >
			<a href="#" key="own" className={ own ? active : inactive } onClick={ (e) => { onOwnClick(); e.preventDefault() }}><Icon className="tiny">done</Icon>{ ' ' }JE POSSEDE</a>
		</span>
	);

	const knowAction = (		
		<span className={ `toggle-know ${know ? active : inactive}`  } >
						{ knowText() }		
		</span>
	);

	return (
		<tr>
			<td><a href='#!' className="teal-text">{ name }</a></td>
			<td style={{ width: '15%' }}>{ type_genre }</td>
			<td style={{ width: '15%' }}>{ pluralize(owners, 'possède', 'possèdent') }</td>
			<td style={{ width: '15%' }}>{ pluralize(knowers, 'explique', 'expliquent') }</td>
			<td style={{ width: '15%' }}>{ ownAction }</td>
			<td style={{ width: '15%' }}>{ knowAction }</td>
		</tr>
	);
};


GameLine.PropTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	img_uri: PropTypes.string.isRequired,
	img_ratio: PropTypes.number.isRequired,
	own: PropTypes.bool,
	know: PropTypes.bool,
	knowers: PropTypes.array.isRequired,
	owners: PropTypes.array.isRequired,
	onClick: PropTypes.func.isRequired
};


export default GameLine;