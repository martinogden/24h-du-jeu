import assert from 'assert';
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Game from 'components/Game';


const createGameWrapper = (props_) => {
	let props = {  // defaults
		name: 'Test Game',
		img_uri: '',
		own: false,
		know: false,
		owners: [],
		knowers: [],
		onOwnClick: () => {},
		onKnowClick: () => {},
		...props_,
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
		const onOwnClick = sinon.spy();
		const wrapper = createGameWrapper({ onOwnClick });

		assert.equal(onOwnClick.callCount, 0);
		wrapper.find('.toggle-own').simulate('click');
		assert.equal(onOwnClick.callCount, 1);
	})

	it('active state should reflect ownership state', () => {
		const wrapperInactive = createGameWrapper({ own: false });
		assert( wrapperInactive.find('.toggle-own').hasClass('inactive') );

		const wrapperActive = createGameWrapper({ own: true });
		assert( wrapperActive.find('.toggle-own').hasClass('active') );
	});

	it('should call click callback when toggle is clicked', () => {
		const onOwnClick = sinon.spy();
		const wrapper = createGameWrapper({ onOwnClick });

		assert.equal(onOwnClick.callCount, 0);
		wrapper.find('.toggle-own').simulate('click');
		assert.equal(onOwnClick.callCount, 1);
	})

	it('active state should reflect knowledge state', () => {
		const wrapperInactive = createGameWrapper({ know: false });
		assert( wrapperInactive.find('.toggle-know').hasClass('inactive') );

		const wrapperActive = createGameWrapper({ know: true });
		assert( wrapperActive.find('.toggle-know').hasClass('active') );
	});
})