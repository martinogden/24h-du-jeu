import React, { PropTypes } from 'react';
import { NavItem as MaterializeNavItem } from 'react-materialize';

const styles = {  // TODO extract inline styles
	img: {
	    margin: '4px 0 0 0',
	},
};


// TODO : replace fixed image by user image

const Userbar = () => (
	<ul className="right">
		<MaterializeNavItem href='#'><img src='/static/img/celine.jpg' className="circle" style={ styles.img }/></MaterializeNavItem>
	</ul>
);

export default Userbar;