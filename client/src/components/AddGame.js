import React, { PropTypes } from 'react';
import { Button } from 'react-materialize';

const AddGame = () => (
	<div className="fixed-action-btn" style={{bottom: '45px', right: '24px',}}>
		<Button floating large className='teal' waves='light' icon='add'/>
	</div>
);

export default AddGame;