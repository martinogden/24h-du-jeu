import React, { PropTypes } from 'react';
import { Button, Modal, Row, Input, Icon } from 'react-materialize';

import BGGSearchbox from './BGGSearchbox';

//TODO Add constraints. e.g. durée
//TODO Get genre lists directly from DB? (type column)
//TODO Use Range for durée??

const AddGame = ({ onSearch, autocomplete, onSelect, bggGame }) => (
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
					<BGGSearchbox id="name" search={ onSearch } select={ onSelect } autocomplete={ autocomplete }/>
					<Input id="id_bgg" s={3} label="ID BoardGameGeek" defaultValue="" value={ bggGame.id } disabled />
					<Input id="type_genre" s={12} m={4} type='select' label="Genre">
					    <option value="" disabled selected={ bggGame.type_genre || 'selected' }>Sélectionner le genre</option>
					    <option value='Ambiance' selected={bggGame.type_genre == 'Ambiance' ? 'selected' : '' }>Ambiance</option>
					    <option value='Coopératif' selected={bggGame.type_genre == 'Coopératif' ? 'selected' : '' }>Coopératif</option>
					    <option value='Enchères' selected={bggGame.type_genre == 'Enchères' ? 'selected' : '' }>Enchères</option>
					    <option value='Enfants' selected={bggGame.type_genre == 'Enfants' ? 'selected' : '' }>Enfants</option>
					    <option value='Gestion' selected={bggGame.type_genre == 'Gestion' ? 'selected' : '' }>Gestion</option>
					    <option value='Parcours' selected={bggGame.type_genre == 'Parcours' ? 'selected' : '' }>Parcours</option>
					    <option value='Placement' selected={bggGame.type_genre == 'Placement' ? 'selected' : '' }>Placement</option>
					    <option value='Stratégie' selected={bggGame.type_genre == 'Stratégie' ? 'selected' : '' }>Stratégie</option>
					</Input>
					<Input id="min_player" s={6} m={2} label="Joueurs min." value={ bggGame.min_player }/>
					<Input id="max_player" s={6} m={2} label="Joueurs max." value={ bggGame.max_player }/>
					<Input id="duration" s={6} m={2} label="Durée (mins)" value={ bggGame.duration }/>
					<Input id="min_age" s={6} m={2} label="Age min." value={ bggGame.min_age }/>
					<div className="input-field col s12">
						<textarea id="description" className="materialize-textarea" value={ bggGame.description }></textarea>
	          			<label for="description">Description</label>
          			</div>
				</Row>
		</Modal>
    </div>
);

AddGame.PropTypes = {
	onSearch: PropTypes.func.isRequired,
	onSelect: PropTypes.func.isRequired,
	autocomplete: PropTypes.func.isRequired,
	bggGame: PropTypes.object,
};

export default AddGame;