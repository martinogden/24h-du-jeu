import React, { PropTypes } from 'react';
import { Row, Col } from 'react-materialize';

import SearchBox from './SearchBox';
import Userbar from './Userbar';

const styles = {  // TODO extract inline styles
	img: {
		margin: '8px 16px 0 0',
	},
};


const Navbar = ({ onSearch }) => (
	<nav>
		<div className="navbar-fixed nav-wrapper orange darken-3">
			<Row>
				<Col s={1}>
			    	<a href="#!" className="brand-logo"><img src='/static/img/logo.png' style={ styles.img }/></a>
			    </Col>
			    <Col s={8} offset={'s2'}>
			    	<SearchBox search={ onSearch } />
			    </Col>
			    <Col s={2}>
			    	<Userbar />
				</Col>
			</Row>
		</div>
	</nav>
);

Navbar.propTypes = {
	onSearch: PropTypes.func.isRequired,
};


export default Navbar;