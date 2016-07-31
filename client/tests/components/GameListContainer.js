import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';
import Waypoint from 'react-waypoint';
import { Preloader } from 'react-materialize';

import GameList from 'components/GameList';
import { GameListContainer } from 'components/GameListContainer';


const createGameListContainerWrapper = (props) => {
	var props = {  // defaults
		games: [],
		isFetching: false,
		fetchNextGames: () => {},
		toggleGameOwnership: () => {},
		toggleGameKnowledge: () => {},
		ownedGameIDs: [],
		knownGameIDs: [],
		...props,
	};

	return shallow(<GameListContainer {...props } />)
}


describe('<GameListContainer/>', () => {

	it('should show pagination component if and only if not fetching', () => {
		const wrapper = createGameListContainerWrapper({ isFetching: true });
		assert.equal(wrapper.find(Waypoint).length, 0);

		wrapper.setProps({ isFetching: false });
		assert.equal(wrapper.find(Waypoint).length, 1);
	})

	it('should show loader component if and only if fetching', () => {
		const wrapper = createGameListContainerWrapper({ isFetching: true });
		assert.equal(wrapper.find(Preloader).length, 1);

		wrapper.setProps({ isFetching: false });
		assert.equal(wrapper.find(Preloader).length, 0);
	})

	it('should pass correct props to <GameList/>', () => {

		const expectedProps = Object.keys(GameList.propTypes);

		const wrapper = createGameListContainerWrapper();
		const elmt = wrapper.find(GameList)
		const props = Object.keys( elmt.props() );

		assert.deepEqual(props, expectedProps);
	})
})