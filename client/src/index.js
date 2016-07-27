import React from 'react';
import { render } from 'react-dom';

import configureStore from './configureStore';
import App from './components/App';


const store = configureStore();

render(
	<App store={ store }/>,
	document.getElementById('root')
);