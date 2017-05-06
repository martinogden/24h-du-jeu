import React, { PropTypes } from 'react';
import { NavItem, Icon } from 'react-materialize';


const Sort = ({ onSortAlpha, onFetchGames, isSortedAlpha, isFiltered }) => {
	if (!isFiltered) {
		if (isSortedAlpha) {
			return (<NavItem href='#' onClick={ onFetchGames }><Icon className='left'>sort_by_alpha</Icon>Date d'ajout</NavItem>);
		}
		else {	
			return(<NavItem href='#' onClick={ onSortAlpha }><Icon className='left'>sort_by_alpha</Icon>Ordre alphabétique</NavItem>);
		}
	}
	else if (isSortedAlpha) {
		return (<NavItem href='#' onClick={ onSortAlpha }><Icon className='left'>reorder</Icon>Tous les jeux</NavItem>);
	}
	else {
		return(<NavItem href='#' onClick={ onFetchGames }><Icon className='left'>reorder</Icon>Tous les jeux</NavItem>);
	}
		
};

Sort.PropTypes = {
	onSortAlpha: PropTypes.func.isRequired,
	onFetchGames: PropTypes.func.isRequired,
	isSortedAlpha: PropTypes.bool.isRequired,
	isFiltered: PropTypes.bool.isRequired,
};

export default Sort;