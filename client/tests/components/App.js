import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';

import { App } from 'components/App';
import Login from 'components/Login';
import GameListContainer from 'components/GameListContainer';


describe('<App/>', () => {

	it('should show  <Login/> if and only if user is logged out', () => {
		const wrapperLoggedIn = shallow(<App isLoggedIn={ false }/>);
		assert.equal(wrapperLoggedIn.find(Login).length, 1);

		const wrapperLoggedOut = shallow(<App isLoggedIn={ true }/>);
		assert.equal(wrapperLoggedOut.find(Login).length, 0);
	})

	it('should show <GameListContainer/> if and only if user is logged in', () => {
		const wrapperLoggedIn = shallow(<App isLoggedIn={ false }/>);
		assert.equal(wrapperLoggedIn.find(GameListContainer).length, 0);

		const wrapperLoggedOut = shallow(<App isLoggedIn={ true }/>);
		assert.equal(wrapperLoggedOut.find(GameListContainer).length, 1);
	})

})