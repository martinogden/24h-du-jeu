import React, { PropTypes } from 'react';
import { Input, Icon } from 'react-materialize';

import BaseSearchbox from './BaseSearchbox';


class BGGSearchbox extends BaseSearchbox {

	renderAutocomplete() {
		const games = this.props.autocomplete;

		if (!games)
			return;

		return (
			<ul>
				{ games.map(game => <li key={ game.id }>{ game.name }</li>) }
			</ul>
		);
	}

	render() {
		return (
			<div>
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