import React, { PropTypes } from 'react';
import { Row, Col } from 'react-materialize';

import SearchBox from './SearchBox';
import Userbar from './Userbar';
import DisplayMode from './DisplayMode';

const styles = {  // TODO extract inline styles
	img: {
		margin: '8px 16px 0 0',
	},
};


const Navbar = ({ onSearch, onLogout, onFetchGamesIKnow, onFetchGamesIOwn }) => (
	<span>
	<div className="navbar-fixed">
		<nav>
			<div className="nav-wrapper orange darken-3">
				<Row>
					<Col s={1} m={1}>
				    	<a href="#!" className="brand-logo"><img src='/static/img/logo.png' style={ styles.img }/></a>
				    </Col>
				    <Col s={8} m={8} offset={'m2'}>
				    	<SearchBox search={ onSearch } />
				    </Col>
				    <Col s={2} m={2}>
					    <ul className="right">
					    	<DisplayMode />
					    	<Userbar onLogout={ onLogout } onFetchGamesIKnow={ onFetchGamesIKnow } onFetchGamesIOwn={ onFetchGamesIOwn } />
					    </ul>
					</Col>
				</Row>
			</div>
		</nav>
	</div>
	</span>
);

Navbar.propTypes = {
	onSearch: PropTypes.func.isRequired,
	onLogout: PropTypes.func.isRequired,
	onFetchGamesIKnow: PropTypes.func.isRequired,
	onFetchGamesIOwn: PropTypes.func.isRequired,
};


export default Navbar;