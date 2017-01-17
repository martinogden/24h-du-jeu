import React, { PropTypes } from 'react';
import { NavItem, Dropdown, Icon } from 'react-materialize';

import { API_ENDPOINT_URL } from '../constants';


const Print = () => {
	return(
		<li>
			<Dropdown 
				trigger={
					<a href='#' className="hide-on-small-only"><Icon>print</Icon></a>
				}
				options={
					{
						constrain_width: false,
						belowOrigin: true,
					}	
				}>

				<NavItem href={ API_ENDPOINT_URL + '/games/pdf/a_apporter/' } target='_blank'>
					A apporter
				</NavItem>
			</Dropdown>
		</li>
	);		
};

export default Print;