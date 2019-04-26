import React, { PropTypes } from 'react';
import { NavItem, Icon, Dropdown } from 'react-materialize';

import Sort from './Sort';

const DisplayMode = ({ onSortAlpha, onFetchGames, isSortedAlpha, isTileDisplay, onToggleDisplay, isFiltered, onFetchGamesIKnow, onFetchGamesIOwn, onFetchBroughtGames, onfetchBroughtGamesSortAlpha }) => {
	const ListOrTile = (isTileDisplay) => {
		if (isTileDisplay) {
			return(<NavItem onClick={ onToggleDisplay }><Icon className='left'>list</Icon>Mode liste</NavItem>);
		} else {
			return(<NavItem onClick={ onToggleDisplay }><Icon className='left'>view_module</Icon>Mode tuiles</NavItem>);
		}
	};

	const FilterBroughtGames = (isSortedAlpha) => {
		if (isSortedAlpha) {
			return(<NavItem onClick={ onfetchBroughtGamesSortAlpha }><Icon className='left'>filter_list</Icon>Jeux pr&eacute;sents cette ann&eacute;e</NavItem>);
		} else {
			return(<NavItem onClick={ onFetchBroughtGames }><Icon className='left'>filter_list</Icon>Jeux pr&eacute;sents cette ann&eacute;e</NavItem>);
		}
	}

	return(
		<li><Dropdown 
			trigger={<a href='#'>Affichage <Icon className='right'>arrow_drop_down</Icon></a>}
			options={{constrain_width: false, belowOrigin: true,}}>
			{ ListOrTile(isTileDisplay) }
			<Sort onSortAlpha={ onSortAlpha } onFetchGames={ onFetchGames } isSortedAlpha={ isSortedAlpha } isFiltered={ isFiltered } />
			<li className="divider"></li>
			{ FilterBroughtGames(isSortedAlpha) }
			<NavItem
				onClick={ onFetchGamesIOwn }>
				<Icon className='left'>filter_list</Icon>Jeux que je possède
			</NavItem>
			<NavItem
				onClick={ onFetchGamesIKnow }>
				<Icon className='left'>filter_list</Icon>Jeux que j&#39;explique
			</NavItem>
			</Dropdown>
		</li>
	);
};


DisplayMode.propTypes = {
	onFetchGamesIKnow: PropTypes.func.isRequired,
	onFetchGamesIOwn: PropTypes.func.isRequired,
	onFetchGames: PropTypes.func.isRequired,
	onSortAlpha: PropTypes.func.isRequired,
	onFetchBroughtGames: PropTypes.func.isRequired,
	onfetchBroughtGamesSortAlpha: PropTypes.func.isRequired,
	onToggleDisplay: PropTypes.func.isRequired,
	isSortedAlpha: PropTypes.bool.isRequired,
	isFiltered: PropTypes.bool.isRequired,
};

export default DisplayMode;