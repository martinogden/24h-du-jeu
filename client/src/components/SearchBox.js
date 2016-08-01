import React, { PropTypes } from 'react';


const ESC_KEY = 27;


class SearchBox extends React.Component {

	constructor(props) {
		super(props);
		this.state = { q: '' };

		this.update = this.update.bind(this);
		this.reset = this.reset.bind(this);
	}

  componentDidMount() {
    window.addEventListener('keypress', this.onKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.onKeyPress);
  }

	update(e) {
		const q = e.target.value;
		this.setState({ q: q });
		this.props.search(q);
	}

	reset() {
		this.setState({ q: '' });
		this.props.search('');
	}

	onKeyPress(e) {
		if (e.keyCode === ESC_KEY) {
			this._cross.click();
			this.reset();
		}
	}

	render() {
		return (
			<div className="input-field" autoComplete="off">

				<input
					id="search"
					type="search"
					style={{ height: '64px' }}  // TODO extract inline styles
					value={ this.state.q }
					onChange={ this.update }
				/>

				<label htmlFor="search">
					<i className="material-icons">search</i>
				</label>

				<i
					className="material-icons"
					onClick={ this.reset }
					ref={ (ref) => this._cross = ref }
					style={{ display: 'block' }}
				>close</i>

			</div>
		);
	}

}

SearchBox.propTypes = {
	search: PropTypes.func.isRequired,
};

export default SearchBox;