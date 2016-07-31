import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';

import GameList, { __RewireAPI__ } from 'components/GameList';


const GameStub = ({ game, onGameClick }) => <div key={ game.id }/>;


describe('<GameList/>', () => {

	it('should render list of games', () => {
		__RewireAPI__.__Rewire__('Game', GameStub);

		const props = {
			games: [
				{id: 1, owners: [], knowers: [] },
				{id: 2, owners: [], knowers: [] },
			],
			onOwnClick: () => {},
			onKnowClick: () => {},
			ownedGameIDs: [],
			knownGameIDs: [],
		};

		const wrapper = shallow(<GameList { ...props } />);

		const games = wrapper.find(GameStub)
		assert.equal(games.length, props.games.length);

	__RewireAPI__.__ResetDependency__('Game', GameStub);
	})

})