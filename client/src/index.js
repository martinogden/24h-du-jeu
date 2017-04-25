import React from 'react';
import { render } from 'react-dom';
import "babel-polyfill"; // for es6 to es5 conversion

import configureStore from './configureStore';
import App from './components/App';


const store = configureStore();

render(
	<App store={ store }/>,
	document.getElementById('root')
);