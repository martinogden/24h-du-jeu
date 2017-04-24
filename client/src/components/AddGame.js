import React, { PropTypes } from 'react';
import { Button, Modal, Row, Input, Icon, Preloader } from 'react-materialize';
import { isEmpty } from 'lodash';

import BGGSearchbox from './BGGSearchbox';

// errorlist has the format:
// [{field: "", errors: ["", ""]},{field: "", errors: [""]}]
const displayErrors = errorlist => {
	const displayListErrors = errors => errors.map(item => {
		return(
			<li key={ errors.indexOf(item) }>
				{ item }
			</li>
		);
	});

	const displayFieldsErrors = errorlist => errorlist.map(item => {
		return(
			<li key={ item.field }>
				{ item.field } : <ul className="browser-default">{ displayListErrors(item.errors) }</ul>
			</li>
		);
	});

	if (errorlist.length > 0){
		return(
			<div className="red-text">
				<ul className="browser-default">{ displayFieldsErrors(errorlist) }</ul>
			</div>
		);
	}
};

export class AddGame extends React.Component {
	constructor(props) {
	  super(props);

	  this.state = { 'bggGame': {}, 'successMessage': '' };
	}

	componentDidUpdate(prevProps, prevState) {
		if (!_.isEmpty(this.props.bggGame) && prevState.bggGame.id_bgg !== this.props.bggGame.id_bgg){
			this.setState({ 'bggGame': this.props.bggGame });
		}
		// empty state after a game successfully entered
		if (_.isEmpty(this.props.bggGame) && prevProps.bggGame.name) {
			var new_bggGame = {}
        	new_bggGame['min_age'] = '';
        	new_bggGame['min_player'] = '';
        	new_bggGame['max_player'] = '';
        	new_bggGame['duration'] = '';
        	new_bggGame['description'] = '';
        	new_bggGame['id_bgg'] = '';
        	new_bggGame['image_bgg'] = '';
        	new_bggGame['type_genre'] = '';
        	new_bggGame['name'] = '';
        	var message = 'Le jeu ' + prevProps.bggGame.name + ' a bien été ajouté.'
			this.setState({ 'bggGame': new_bggGame, 'successMessage': message });
			this.setState({ 'bggGame': new_bggGame });
		}
	}

	handleInput(name, e) {
		const bggGame = { ...this.state.bggGame };
		bggGame[name] = e.target.value;
		this.setState({ 'bggGame': bggGame });
	}

	handleSubmit(e) {
		e.preventDefault();
		var fd = new FormData(e.target);
		this.props.onAddGame(fd);
	}
	getLoader(isAddingGame) {
		if (isAddingGame) {
			return (
				<div style={{ position: 'fixed', top: 0, left: 0, background: 'rgba(255, 255, 255, 0.8)', width: '100%', height: '100%', textAlign: 'center', zIndex: 100 }}>
					<div style={{ margin: '240px auto' }}>
						<Preloader style={{ display: 'block', margin: '50px auto' }} size="small" flashing/>
					</div>
				</div>
			);
		}
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
					// no actions button (using custom button inside form)
					actions= {
						<span></span>
					}>
						<form onSubmit={ this.handleSubmit.bind(this) } method="post" action="http://localhost:8000/api/games/game/">

						<Row>
							<span className='green-text'>{ this.state.successMessage }</span>
							{ displayErrors(this.props.errors) }
							{ this.getLoader(this.props.isAddingGame) }
						</Row>

						<Row>
							<BGGSearchbox search={ this.props.onSearch } select={ this.props.onSelect } autocomplete={ this.props.autocomplete }/>
							<Input name="id_bgg" s={3} label="ID BoardGameGeek" defaultValue=" " value={ this.state.bggGame.id_bgg } readonly='readonly' style={{color: '#9e9e9e'}} />
							<Input name="type_genre" s={12} m={4} type='select' label="Genre">
								<option  disabled selected={ this.state.bggGame.type_genre || 'selected' }>Sélectionner le genre</option>
								<option  selected={this.state.bggGame.type_genre == 'Ambiance' ? 'selected' : '' }>Ambiance</option>
								<option  selected={this.state.bggGame.type_genre == 'Coopératif' ? 'selected' : '' }>Coopératif</option>
								<option  selected={this.state.bggGame.type_genre == 'Enchères' ? 'selected' : '' }>Enchères</option>
								<option  selected={this.state.bggGame.type_genre == 'Enfants' ? 'selected' : '' }>Enfants</option>
								<option  selected={this.state.bggGame.type_genre == 'Gestion' ? 'selected' : '' }>Gestion</option>
								<option  selected={this.state.bggGame.type_genre == 'Parcours' ? 'selected' : '' }>Parcours</option>
								<option  selected={this.state.bggGame.type_genre == 'Placement' ? 'selected' : '' }>Placement</option>
								<option  selected={this.state.bggGame.type_genre == 'Stratégie' ? 'selected' : '' }>Stratégie</option>
							</Input>
							<Input name="min_player" s={6} m={2} label="Joueurs min." defaultValue=" " value={ this.state.bggGame.min_player } onChange={ this.handleInput.bind(this, 'min_player') }/>
							<Input name="max_player" s={6} m={2} label="Joueurs max." defaultValue=" " value={ this.state.bggGame.max_player } onChange={ this.handleInput.bind(this, 'max_player') }/>
							<Input name="duration" s={6} m={2} label="Durée (mins)" defaultValue=" " value={ this.state.bggGame.duration } onChange={ this.handleInput.bind(this, 'duration') }/>
							<Input name="min_age" s={6} m={2} label="Age min." defaultValue=" " value={ this.state.bggGame.min_age } onChange={ this.handleInput.bind(this, 'min_age') }/>
							<div className="input-field col s12">
								<textarea name="description" className="materialize-textarea" defaultValue=" " value={ this.state.bggGame.description } onChange={ this.handleInput.bind(this, 'description') }></textarea>
								<label for="description">Description</label>
							</div>
							<Input name="image_bgg" s={3} value={ this.state.bggGame.image } type='hidden' />
						</Row>
						<div>
							<Button modal="close" waves="light" type="reset" className="left grey" style={{zIndex: 0,}}>Fermer</Button>
							<Button modal="confirm" waves="light" type="submit" className="teal right" style={{zIndex: 0,}}>Ajouter</Button>
						</div>
						</form>
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
	isAddingGame: PropTypes.bool.isRequired,
	bggGame: PropTypes.object,
	errors: PropTypes.object,
};

export default AddGame;