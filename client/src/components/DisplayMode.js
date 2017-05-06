import React, { PropTypes } from 'react';
import { NavItem, Icon, Dropdown } from 'react-materialize';

import Sort from './Sort';

const DisplayMode = ({ onSortAlpha, onFetchGames, isSortedAlpha, isFiltered, onFetchGamesIKnow, onFetchGamesIOwn }) => {
	return(
		<li><Dropdown 
			trigger={<a href='#'>Affichage <Icon className='right'>arrow_drop_down</Icon></a>}
			options={{constrain_width: false, belowOrigin: true,}}>
			<Sort onSortAlpha={ onSortAlpha } onFetchGames={ onFetchGames } isSortedAlpha={ isSortedAlpha } isFiltered={ isFiltered } />
			<li className="divider"></li>
			<NavItem
				onClick={ onFetchGamesIOwn }>
				<Icon className='left'>filter_list</Icon>Je possède
			</NavItem>
			<NavItem
				onClick={ onFetchGamesIKnow }>
				<Icon className='left'>filter_list</Icon>J&#39;explique
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
	isSortedAlpha: PropTypes.bool.isRequired,
	isFiltered: PropTypes.bool.isRequired,
};

export default DisplayMode;