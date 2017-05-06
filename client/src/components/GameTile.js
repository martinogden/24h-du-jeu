import React, { PropTypes } from 'react';
import { Card, CardTitle, Icon } from 'react-materialize';

const styles = {
	cardTitle: {
		lineHeight: '24px',
		padding: '12px 0',
		display: 'block',
	},
	noSplit: {
		whiteSpace: 'nowrap',
	}
};

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


const GameTile = ({ name, img_uri, img_ratio, own, know, owners, knowers, onOwnClick, onKnowClick }) => {
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

	// https://www.perpetual-beta.org/weblog/responsive-images-without-browser-reflow.html
	const Header = () => (
		<div className="card-image" onDoubleClick={ onKnowClick }>
			<div style={{ position: "relative", width: "100%", paddingBottom: ( 100 * img_ratio ) + "%" }}>
				<img src={ img_uri } style={{ width: "100%", height: "100%", position: "absolute", background: "#eff0f1", backgroundImage: "url('/static/img/placeholder.png')", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}/>
			</div>
		</div>
	);

	const knowText = () => {
		if (own)
			return(<span><Icon className="tiny">done_all</Icon>{ ' ' }J&#39;EXPLIQUE</span>)
		else
			return(<a href="#" key="know" className={ know ? active : inactive }  onClick={ (e) => { onKnowClick(); e.preventDefault() }}><Icon className="tiny">done_all</Icon>{ ' ' }j&#39;explique</a>)
	};

	const actions = (
		<div>
			<span className={ `toggle-own ${own ? active : inactive}` } style={ styles.noSplit }>
				<a href="#" key="own" className={ own ? active : inactive } onClick={ (e) => { onOwnClick(); e.preventDefault() }}><Icon className="tiny">done</Icon>{ ' ' }je possède</a>
			</span>
			<span></span>
			<span className={ `toggle-know ${know ? active : inactive}` } style={ styles.noSplit }>
							{ knowText() }		
			</span>
		</div>
	);

	return (
		<div className="col s12 m4 l3">
			<Card header={ <Header/> } reveal={ reveal } actions={ [actions] } className="sticky-action">

				<span className="card-title grey-text text-darken-4 activator" style={ styles.cardTitle }>
					{ name }
					<i className="material-icons right">group</i>
				</span>

			</Card>
		</div>
	);
};


GameTile.PropTypes = {
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


export default GameTile;