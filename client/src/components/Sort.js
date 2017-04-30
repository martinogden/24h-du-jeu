import React, { PropTypes } from 'react';
import { NavItem, Icon } from 'react-materialize';


const Sort = ({ onSortAlpha, onFetchGames, isSortedAlpha }) => {
	if (isSortedAlpha) {
		return (<NavItem href='#' onClick={ onFetchGames }><Icon>fiber_new</Icon></NavItem>);
	}
	else {	
		return(<NavItem href='#' onClick={ onSortAlpha }><Icon>sort_by_alpha</Icon></NavItem>);
	}
		
};

Sort.PropTypes = {
	onSortAlpha: PropTypes.func.isRequired,
	onFetchGames: PropTypes.func.isRequired,
	isSortedAlpha: PropTypes.bool.isRequired,
};

export default Sort;