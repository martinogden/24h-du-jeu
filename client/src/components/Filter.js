import React, { PropTypes } from 'react';
import { NavItem, Dropdown, Icon } from 'react-materialize';


const Filter = ({ onFetchGamesIKnow, onFetchGamesIOwn }) => {
	return(
		<li>
			<Dropdown 
				trigger={
					<a href='#'><Icon>filter_list</Icon></a>
				}
				options={
					{
						constrain_width: false,
						belowOrigin: true,
					}	
				}>

				<NavItem
					onClick={ onFetchGamesIOwn }>
					Je possède
				</NavItem>
				<NavItem
					onClick={ onFetchGamesIKnow }>
					J&#39;explique
				</NavItem>
			</Dropdown>
		</li>
	);		
};

export default Filter;