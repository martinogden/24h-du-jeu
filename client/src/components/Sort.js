import React, { PropTypes } from 'react';
import { NavItem, Icon, Dropdown } from 'react-materialize';


const Sort = ({ onSortAlpha, onFetchGames, isSortedAlpha }) => {
	const getNavItem = () => {
		if (isSortedAlpha) {
			return (<NavItem href='#' onClick={ onFetchGames }>Par date d'ajout</NavItem>);
		}
		else {	
			return(<NavItem href='#' onClick={ onSortAlpha }>Par ordre alphabétique</NavItem>);
		}
	};

	return(
		<li>
			<Dropdown 
				trigger={
					<a href='#'><Icon>sort_by_alpha</Icon></a>
				}
				options={
					{
						constrain_width: false,
						belowOrigin: true,
					}	
				}>
				{ getNavItem() }
			</Dropdown>
		</li>
	);
		
};

Sort.PropTypes = {
	onSortAlpha: PropTypes.func.isRequired,
	onFetchGames: PropTypes.func.isRequired,
	isSortedAlpha: PropTypes.bool.isRequired,
};

export default Sort;