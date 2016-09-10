import React, { PropTypes } from 'react';


const KeyCode = {
	ESC: 27,
};


class BaseSearchbox extends React.Component {

	constructor(props) {
		super(props);
		this.state = { q: '' };

		this.update = this.update.bind(this);
		this.reset = this.reset.bind(this);
	}

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyPress.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyPress.bind(this));
  }

  /**
   * update state and dispatch search action
   */
	update(e) {
		const q = e.target.value;
		this.setState({ q: q });
		this.props.search(q);
	}

	/**
	 * reset state and dispatch empty search action
	 */
	reset() {
		this.setState({ q: '' });
		this.props.search('');
	}

	/**
	 * Escape key clears search input and remove focus
	 */
	onKeyPress({ keyCode }) {
		const active = document.activeElement;
		const input = this._input;

		if (keyCode === KeyCode.ESC && (input === active || this.state.q)) {
				input.blur();
				this.reset();
				return false;
		}
	}

}

BaseSearchbox.propTypes = {
	search: PropTypes.func.isRequired,
};

export default BaseSearchbox;