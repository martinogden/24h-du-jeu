import React, { PropTypes } from 'react';
import { NavItem, Dropdown } from 'react-materialize';

const styles = {  // TODO extract inline styles
	img: {
		height: '32px',
		position: 'relative',
    	top: '12px',
	},
};


// TODO : replace fixed image by user image

const Userbar = () => (
		<li>
			<Dropdown 
				trigger={
					<a href='#'><img src='/static/img/celine.jpg' className="circle" style={ styles.img }/></a>
				}
				options={
					{
						belowOrigin: true,
					}	
				}>

				<NavItem>Logout</NavItem>
			</Dropdown>
		</li>
);

export default Userbar;