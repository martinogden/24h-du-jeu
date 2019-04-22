import React, { PropTypes } from 'react';
import { Icon, Modal, Button } from 'react-materialize';


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
		<div className="row">
			<div className="col s12 m5">
				<img src={ img_uri } style={{ background: "#eff0f1", backgroundImage: "url('/static/img/placeholder.png')", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}/>
				<div className="show-on-small hide-on-med-and-up">
					<strong>{ pluralize(owners, 'possède', 'possèdent') }</strong>
					<ul className="owner-list">{ li(owners) }</ul>
				</div>
				<div className="show-on-small hide-on-med-and-up">
					<strong>{ pluralize(knowers, 'explique', 'expliquent') }</strong>
					<ul className="knower-list">{ li(knowers) }</ul>
				</div>
			</div>
			<div className="col offset-m1 m3 hide-on-small-and-down">
				<strong>{ pluralize(owners, 'possède', 'possèdent') }</strong>
				<ul className="owner-list">{ li(owners) }</ul>
			</div>
			<div className="col m3 hide-on-small-and-down">
				<strong>{ pluralize(knowers, 'explique', 'expliquent') }</strong>
				<ul className="knower-list">{ li(knowers) }</ul>
			</div>
		</div>
	);

	const ownAction = (
		<span className={ `toggle-own ${own ? active : inactive}`  } >
			<a href="#" key="own" className={ own ? active : inactive } onClick={ (e) => { onOwnClick(); e.preventDefault() }}><Icon className="tiny">done</Icon>{ ' ' }JE POSSEDE</a>
		</span>
	);

	const knowAction = (		
		<span className={ `toggle-know ${know ? active : inactive}`  } >
			<a href="#" key="know" className={ know ? active : inactive }  onClick={ (e) => { onKnowClick(); e.preventDefault() }}><Icon className="tiny">done_all</Icon>{ ' ' }J&#39;EXPLIQUE</a>		
		</span>
	);

	return (
		<tr>
			<td>
				<Modal
					header={ name }
					fixedFooter
					actions={[<Button waves='light' modal='close' className='grey'>Fermer</Button>]}
					trigger={
					<a href='#!' className="teal-text">{ name }</a>
					}>
					{ reveal }
				</Modal>
			</td>
			<td style={{ width: '15%' }} className='hide-on-small-and-down'>{ type_genre }</td>
			<td style={{ width: '15%' }} className='hide-on-small-and-down'>{ pluralize(owners, 'possède', 'possèdent') }</td>
			<td style={{ width: '15%' }} className='hide-on-small-and-down'>{ pluralize(knowers, 'explique', 'expliquent') }</td>
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