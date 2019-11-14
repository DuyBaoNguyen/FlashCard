import React, { Component } from 'react';

import './Feature.css';

class Feature extends Component {
	onClick = () => {
		this.props.onChange("true");
	}
	render() {
		return (
			<div class="feature-content-feature" onClick={this.onChange}>
				<div class="feature-content-feature-image"></div>
				<div class="feature-content-feature-name-highlight">Flashcard</div>
			</div>
		);
	}
}

export default Feature;
