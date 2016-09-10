import React, { PropTypes } from 'react';

import BaseSearchbox from './BaseSearchbox';



const styles = {  // TODO extract inline styles
	input: {
		height: '64px',
	},
};


class SearchBox extends BaseSearchbox {

	render() {
		return (
			<div className="input-field">

				<input
					id="search"
					type="search"
					style={ styles.input }
					value={ this.state.q }
					tabIndex="0"
					ref={ (ref) => this._input = ref }
					onChange={ this.update }
					autoComplete="off"
				/>

				<label htmlFor="search">
					<i className="material-icons">search</i>
				</label>

				<i
					className="material-icons"
					onClick={ this.reset }
				>close</i>

			</div>
		);
	}

}

export default SearchBox;