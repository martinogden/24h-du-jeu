import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Game, { __RewireAPI__ } from '../../components/Game.jsx';


const createGameWrapper = (props) => {
	var props = {  // defaults
		name: 'Test Game',
		img_uri: '',
		own: false,
		know: false,
		owners: [],
		knowers: [],
		onClick: () => {},
		...props,
	};

	return shallow(<Game {...props } />)
}


describe('<Game/>', () => {

	it('should show owner and knower counts', () => {
		const wrapper = createGameWrapper({
			owners: [],
			knowers: ['alice'],
		});

		assert.equal(
			wrapper.find('.owner-count').text(),
			'0 apportent'
		);

		assert.equal(
			wrapper.find('.knower-count').text(),
			'1 explique'
		);
	})

	it('should call click callback when toggle is clicked', () => {
		const onClick = sinon.spy();
		const wrapper = createGameWrapper({ onClick });

		assert.equal(onClick.callCount, 0);
		wrapper.find('.toggle-own').simulate('click');
		assert.equal(onClick.callCount, 1);
	})

	it('active state should reflect ownership state', () => {
		const wrapperInactive = createGameWrapper({ own: false });
		assert( wrapperInactive.find('.toggle-own').hasClass('inactive') );

		const wrapperActive = createGameWrapper({ own: true });
		assert( wrapperActive.find('.toggle-own').hasClass('active') );
	});

	it('should call click callback when toggle is clicked', () => {
		const onClick = sinon.spy();
		const wrapper = createGameWrapper({ onClick });

		assert.equal(onClick.callCount, 0);
		wrapper.find('.toggle-own').simulate('click');
		assert.equal(onClick.callCount, 1);
	})

	it('active state should reflect knowledge state', () => {
		const wrapperInactive = createGameWrapper({ know: false });
		assert( wrapperInactive.find('.toggle-know').hasClass('inactive') );

		const wrapperActive = createGameWrapper({ know: true });
		assert( wrapperActive.find('.toggle-know').hasClass('active') );
	});
})