import React, { PropTypes } from 'react';
import { NavItem, Icon } from 'react-materialize';

import { API_ENDPOINT_URL } from '../constants';


const Print = () => {
	return(
		<li className="hide-on-small-and-down">
			<a href={ API_ENDPOINT_URL + '/games/pdf/a_apporter/' } target='_blank'>
				<Icon>print</Icon>
			</a>
		</li>
	);		
};

export default Print;