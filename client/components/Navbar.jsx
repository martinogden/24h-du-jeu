import React from 'react';
import { Navbar as MaterializeNavbar, NavItem, Icon } from 'react-materialize';


const Navbar = () => (
	<div className="navbar-fixed">
		<MaterializeNavbar brand='&nbsp;24h du Jeu' right>
			<NavItem href='#'><Icon>search</Icon></NavItem>
		</MaterializeNavbar>
	</div>
);


export default Navbar;