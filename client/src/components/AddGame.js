import React, { PropTypes } from 'react';
import { Button, Modal, Row, Input, Icon } from 'react-materialize';

import BGGSearchbox from './BGGSearchbox';

//TODO Add constraints. e.g. durée
//TODO Get genre lists directly from DB? (type column)
//TODO Use Range for durée??

const AddGame = ({ onSearch, autocomplete }) => (
	<div>
		<Modal
			//header='Nouveau jeu'
			trigger={
				<div className="fixed-action-btn" style={{bottom: '45px', right: '24px',}}>
					<Button floating large className='teal' waves='light' icon='add'/>
				</div>
			}
			actions={
				<div>
			      <Button modal="close" waves="light" className="teal">Ajouter</Button>
			    </div>
			}>
				<Row>
					<BGGSearchbox id="id_bgg" search={ onSearch } autocomplete={ autocomplete }/>
					<Input s={3} label="ID BoardGameGeek" defaultValue="" disabled />
					<Input id="type_genre" s={12} m={4} type='select' label="Genre">
					    <option value="" disabled selected>Sélectionner le genre</option>
					    <option value='1'>Ambiance</option>
					    <option value='2'>Coopératif</option>
					    <option value='3'>Enchères</option>
					    <option value='4'>Enfants</option>
					    <option value='5'>Gestion</option>
					    <option value='6'>Logique</option>
					    <option value='7'>Parcours</option>
					    <option value='8'>Placement</option>
					    <option value='9'>Stratégie</option>
					</Input>
					<Input id="min_player" s={6} m={2} label="Joueurs min." />
					<Input id="max_player" s={6} m={2} label="Joueurs max." />
					<Input id="duration" s={6} m={2} label="Durée (mins)" />
					<Input id="min_age" s={6} m={2} label="Age min." />
					<div className="input-field col s12">
						<textarea id="description" className="materialize-textarea"></textarea>
	          			<label for="description">Description</label>
          			</div>
				</Row>
		</Modal>
    </div>
);

AddGame.PropTypes = {
	onSearch: PropTypes.func.isRequired,
	autocomplete: PropTypes.func.isRequired,
};

export default AddGame;