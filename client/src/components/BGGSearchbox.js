import React, { PropTypes } from 'react';
import Autocomplete from 'react-autocomplete';
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
		backgroundColor: '#fff',
		zIndex: '1',
	},
	wrapper: {
		width: '75%',
		marginLeft: 'auto',
		right: 'auto',
		float: 'left',
		boxSizing: 'border-box',
		padding: '0 0.75rem',
	},
	item: {
		padding: '2px 6px', 
		cursor: 'default',
	},
	highlightedItem: {
		padding: '2px 6px', 
		cursor: 'default',
		color: 'white',
		background: 'rgb(63, 149, 191)',
	},
};


class BGGSearchbox extends BaseSearchbox {

	close() {
		this.reset();
	}

	renderSuggestion(game) {

		return (
			<li className="ac-item"
				value={ game.objectid }
				key={ game.objectid }
			>
				<a href='javascript:void(0)'>{ game.name }</a>
			</li>
		);
	}

	renderAutocomplete() {
		const games = this.props.autocomplete;

		if (!games)
			return;

		return (
			<ul id="singleDropdown"
				className="dropdown-content select-dropdown"
			    style={ styles.autodropdown }>
				{ games.map( this.renderSuggestion.bind(this) ) }
			</ul>
		);
	}

	render() {
		return (
			<div>
{/* 				Nice Materialize Dropdown. TODO: Copy styling
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
*/}

			
				<Autocomplete
					inputProps={{name: "Titre", id: "games-autocomplete"}}
					ref="autocomplete"
					value={this.state.q}
					items={this.props.autocomplete}
					getItemValue={(item) => item.name}
					onChange={ this.update }
					onSelect={(value, item) => {
						this.props.select(item.objectid);
						this.setState({ q: value })
						
					}}
					renderItem={(item, isHighlighted) => (
						<div
							style={isHighlighted ? styles.highlightedItem : styles.item}
							key={item.objectid}
							id={item.objectid}
						>{item.name}</div>
					)}
					wrapperStyle = { styles.wrapper }
					menuStyle={ styles.autodropdown }
				/>
				
			</div>

		);
	}

}

BGGSearchbox.propTypes = {
	select: PropTypes.func.isRequired,
};

export default BGGSearchbox;