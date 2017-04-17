import React, { PropTypes } from 'react';
import { Row, Col } from 'react-materialize';

import SearchBox from './SearchBox';
import Userbar from './Userbar';
import DisplayMode from './DisplayMode';
import Print from './Print';
import Filter from './Filter';

const styles = {  // TODO extract inline styles
	img: {
		margin: '8px 16px 0 0',
	},
};


const Navbar = ({ loggedInUser, onSearch, onLogout, onFetchGamesIKnow, onFetchGamesIOwn }) => (
	<span>
	<div className="navbar-fixed">
		<nav>
			<div className="nav-wrapper orange darken-3">
				<Row>
					<Col s={1} m={1}>
				    	<a href="#!" className="brand-logo"><img src='/static/img/logo.png' style={ styles.img }/></a>
				    </Col>
				    <Col s={6} m={6} offset={'m2'}>
				    	<SearchBox search={ onSearch } />
				    </Col>
				    
					    <ul className="right hide-on-small-and-down">
					    	{/*<DisplayMode />*/}
					    	<Filter onFetchGamesIKnow={ onFetchGamesIKnow } onFetchGamesIOwn={ onFetchGamesIOwn } />
					    	<Print />
					    	<Userbar loggedInUser={ loggedInUser } onLogout={ onLogout } />
					   </ul>
					
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
	loggedInUser: PropTypes.object.isRequired,
};


export default Navbar;