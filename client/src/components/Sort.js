import React, { PropTypes } from 'react';
import { NavItem, Icon } from 'react-materialize';


const Sort = ({ onSortAlpha, onFetchGames, isSortedAlpha, isFiltered }) => {
	if (!isFiltered) {
		if (isSortedAlpha) {
			return (<NavItem href='#' onClick={ onFetchGames }><Icon className='left'>sort_by_alpha</Icon>Par date d'ajout</NavItem>);
		}
		else {	
			return(<NavItem href='#' onClick={ onSortAlpha }><Icon className='left'>sort_by_alpha</Icon>Par ordre alphabétique</NavItem>);
		}
	}
	else if (isSortedAlpha) {
		return (<NavItem href='#' onClick={ onSortAlpha }><Icon className='left'>list</Icon>Tous les jeux</NavItem>);
	}
	else {
		return(<NavItem href='#' onClick={ onFetchGames }><Icon className='left'>list</Icon>Tous les jeux</NavItem>);
	}
		
};

Sort.PropTypes = {
	onSortAlpha: PropTypes.func.isRequired,
	onFetchGames: PropTypes.func.isRequired,
	isSortedAlpha: PropTypes.bool.isRequired,
	isFiltered: PropTypes.bool.isRequired,
};

export default Sort;