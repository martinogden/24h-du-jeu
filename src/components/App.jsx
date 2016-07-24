import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Navbar, NavItem, Icon } from 'react-materialize';

import GameListContainer from './GameListContainer.jsx';


const App = ({ store }) => (
	<div>
		<div className="navbar-fixed">
			<Navbar brand='&nbsp;24h du Jeu' right>
				<NavItem href='#'><Icon>search</Icon></NavItem>
			</Navbar>
		</div>

		<Provider store={ store }>
			<GameListContainer />
		</Provider>
	</div>
);

App.PropTypes = {
	store: PropTypes.object.isRequired
}


export default App;