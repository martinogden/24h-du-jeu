import React, { PropTypes } from 'react';
import { Button, Modal, Row, Input, Icon } from 'react-materialize';

import BGGSearchbox from './BGGSearchbox';

//TODO Add constraints. e.g. durée
//TODO Get genre lists directly from DB? (type column)
//TODO Use Range for durée??

export class AddGame extends React.Component {
	constructor(props) {
	  super(props);

	  this.state = { 'bggGame': {} };
	  //this.handleMinPlayerChange = this.handleMinPlayerChange.bind(this);
  	}

  	componentDidUpdate(prevProps, prevState) {
  		if (this.props.bggGame && prevState.bggGame.id_bgg !== this.props.bggGame.id_bgg)
			this.setState({ 'bggGame': this.props.bggGame });
  	}

	handleInput(name, e) {
		const bggGame = { ...this.state.bggGame };
		bggGame[name] = e.target.value;
		this.setState({ 'bggGame': bggGame });
	}

	render() {
		return (
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
					      <Button modal="close" onClick={ this.props.onAddGame } waves="light" className="teal">Ajouter</Button>
					    </div>
					}>
						<Row>
							<BGGSearchbox id="name" search={ this.props.onSearch } select={ this.props.onSelect } autocomplete={ this.props.autocomplete }/>
							<Input id="id_bgg" s={3} label="ID BoardGameGeek" defaultValue=" " value={ this.state.bggGame.id_bgg } disabled />
							<Input id="type_genre" s={12} m={4} type='select' label="Genre">
							    <option value="" disabled selected={ this.state.bggGame.type_genre || 'selected' }>Sélectionner le genre</option>
							    <option value='Ambiance' selected={this.state.bggGame.type_genre == 'Ambiance' ? 'selected' : '' }>Ambiance</option>
							    <option value='Coopératif' selected={this.state.bggGame.type_genre == 'Coopératif' ? 'selected' : '' }>Coopératif</option>
							    <option value='Enchères' selected={this.state.bggGame.type_genre == 'Enchères' ? 'selected' : '' }>Enchères</option>
							    <option value='Enfants' selected={this.state.bggGame.type_genre == 'Enfants' ? 'selected' : '' }>Enfants</option>
							    <option value='Gestion' selected={this.state.bggGame.type_genre == 'Gestion' ? 'selected' : '' }>Gestion</option>
							    <option value='Parcours' selected={this.state.bggGame.type_genre == 'Parcours' ? 'selected' : '' }>Parcours</option>
							    <option value='Placement' selected={this.state.bggGame.type_genre == 'Placement' ? 'selected' : '' }>Placement</option>
							    <option value='Stratégie' selected={this.state.bggGame.type_genre == 'Stratégie' ? 'selected' : '' }>Stratégie</option>
							</Input>
							<Input id="min_player" s={6} m={2} label="Joueurs min." defaultValue=" " value={ this.state.bggGame.min_player } onChange={ this.handleInput.bind(this, 'min_player') }/>
							<Input id="max_player" s={6} m={2} label="Joueurs max." defaultValue=" " value={ this.state.bggGame.max_player } onChange={ this.handleInput.bind(this, 'max_player') }/>
							<Input id="duration" s={6} m={2} label="Durée (mins)" defaultValue=" " value={ this.state.bggGame.duration } onChange={ this.handleInput.bind(this, 'duration') }/>
							<Input id="min_age" s={6} m={2} label="Age min." defaultValue=" " value={ this.state.bggGame.min_age } onChange={ this.handleInput.bind(this, 'min_age') }/>
							<div className="input-field col s12">
								<textarea id="description" className="materialize-textarea" defaultValue=" " value={ this.state.bggGame.description } onChange={ this.handleInput.bind(this, 'description') }></textarea>
			          			<label for="description">Description</label>
		          			</div>
						</Row>
				</Modal>
		    </div>
	    );
	}
};

AddGame.PropTypes = {
	onSearch: PropTypes.func.isRequired,
	onSelect: PropTypes.func.isRequired,
	onAddGame: PropTypes.func.isRequired,
	autocomplete: PropTypes.func.isRequired,
	bggGame: PropTypes.object,
};

export default AddGame;