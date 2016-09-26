import React, { PropTypes } from 'react';
import { Input, Icon } from 'react-materialize';

import BaseSearchbox from './BaseSearchbox';

const styles = {  // TODO extract inline styles
	autodropdown: {
		width: '1005px',
		position: 'absolute',
		top: '60px', 
		left: '11.25px', 
		opacity: '1',
		display: 'block',
	},
};


class BGGSearchbox extends BaseSearchbox {

	close() {
		this.reset();
	}

	renderSuggestion(game) {

		return (
			<li
				key={ game.id }
				onClick={ this.close.bind(this) }
			>
				{ game.name }
			</li>
		);
	}

	renderAutocomplete() {
		const games = this.props.autocomplete;

		if (!games)
			return;

		return (
			<ul className="dropdown-content select-dropdown active"
			    style={ styles.autodropdown }>
				{ games.map( this.renderSuggestion.bind(this) ) }
			</ul>
		);
	}

	render() {
		return (
			<div style={{position: "relative"}}>
				<Input 
					s={9}
					label="Titre"
					value={ this.state.q }
					ref={ (ref) => this._input = ref }
					onChange={ this.update }
					autoComplete="off"
				>
					<Icon>mode_edit</Icon>
				</Input>
				{ this.renderAutocomplete() }
			</div>

		);
	}

}

export default BGGSearchbox;