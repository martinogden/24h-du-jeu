import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';

import GameListContainer from './GameListContainer.jsx';


const App = ({ store }) => (
	<Provider store={ store }>
		<GameListContainer />
	</Provider>
);

App.PropTypes = {
	store: PropTypes.object.isRequired
}


export default App;