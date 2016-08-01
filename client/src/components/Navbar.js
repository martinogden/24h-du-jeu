import React, { PropTypes } from 'react';
import { Navbar as MaterializeNavbar } from 'react-materialize';

import SearchBox from './SearchBox';


const Navbar = ({ onSearch }) => (
	<div className="navbar-fixed">
		<MaterializeNavbar className="orange darken-3">
			<SearchBox search={ onSearch } />
		</MaterializeNavbar>
	</div>
);

Navbar.propTypes = {
	onSearch: PropTypes.func.isRequired,
};


export default Navbar;