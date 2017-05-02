import React, { PropTypes } from 'react';
import { Row, Col } from 'react-materialize';

import SearchBox from './SearchBox';
import Userbar from './Userbar';
import DisplayMode from './DisplayMode';
import Print from './Print';
import Filter from './Filter';
import Sort from './Sort';

const styles = {  // TODO extract inline styles
	img: {
		margin: '8px 16px 0 0',
	},
};


const Navbar = ({ loggedInUser, onSearch, onLogout, onSortAlpha, isSortedAlpha, isFiltered, onFetchGames, onFetchGamesIKnow, onFetchGamesIOwn }) => {
	const sortItem = () => {
		if (!isFiltered)
			return(<Sort onSortAlpha={ onSortAlpha } onFetchGames={ onFetchGames } isSortedAlpha={ isSortedAlpha } />);
	};

	return (
		<span>
		<div className="navbar-fixed">
			<nav>
				<div className="nav-wrapper orange darken-3">
					<Row>
						<Col s={1} m={1}>
					    	<a href="#!" className="brand-logo"><img src='/static/img/logo.png' style={ styles.img }/></a>
					    </Col>
					    <Col s={7} m={6} offset={'m2'}>
					    	<SearchBox search={ onSearch } />
					    </Col>
					    
						    <ul className="right">
						    	{/*<DisplayMode />*/}
						    	{/* We don't display the sorting icon if we display the games we know/own */}
						    	{ sortItem() }
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
};

Navbar.propTypes = {
	onSearch: PropTypes.func.isRequired,
	onLogout: PropTypes.func.isRequired,
	onFetchGamesIKnow: PropTypes.func.isRequired,
	onFetchGamesIOwn: PropTypes.func.isRequired,
	onFetchGames: PropTypes.func.isRequired,
	onSortAlpha: PropTypes.func.isRequired,
	loggedInUser: PropTypes.object.isRequired,
	isSortedAlpha: PropTypes.bool.isRequired,
	isFiltered: PropTypes.bool.isRequired,
};


export default Navbar;