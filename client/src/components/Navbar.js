import React, { PropTypes } from 'react';
import { Row, Col, Dropdown, Icon } from 'react-materialize';

import SearchBox from './SearchBox';
import Userbar from './Userbar';
import DisplayMode from './DisplayMode';
import Print from './Print';

const styles = {  // TODO extract inline styles
	img: {
		margin: '8px 16px 0 0',
	},
};


const Navbar = ({ loggedInUser, onSearch, onLogout, onSortAlpha, isSortedAlpha, isFiltered, isTileDisplay, onToggleDisplay, onFetchGames, onFetchGamesIKnow, onFetchGamesIOwn }) => {
	return (
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
						    <ul className="right">
						    	<DisplayMode onFetchGamesIKnow={ onFetchGamesIKnow } onFetchGamesIOwn={ onFetchGamesIOwn } isFiltered={ isFiltered }
						    				 onToggleDisplay={ onToggleDisplay } isTileDisplay={ isTileDisplay } onSortAlpha={ onSortAlpha } onFetchGames={ onFetchGames } isSortedAlpha={ isSortedAlpha } />
						    	<Print />
						    	<Userbar loggedInUser={ loggedInUser } onLogout={ onLogout } />
						   </ul>
						
					</Row>
				</div>
			</nav>
		</div>
		</span>
	);
};

Navbar.propTypes = {
	onSearch: PropTypes.func.isRequired,
	onLogout: PropTypes.func.isRequired,
	onFetchGamesIKnow: PropTypes.func.isRequired,
	onFetchGamesIOwn: PropTypes.func.isRequired,
	onFetchGames: PropTypes.func.isRequired,
	onSortAlpha: PropTypes.func.isRequired,
	onToggleDisplay: PropTypes.func.isRequired,
	loggedInUser: PropTypes.object.isRequired,
	isSortedAlpha: PropTypes.bool.isRequired,
	isFiltered: PropTypes.bool.isRequired,
	isTileDisplay: PropTypes.bool.isRequired,
};


export default Navbar;