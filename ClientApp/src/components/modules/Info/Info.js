import React, { Component } from 'react';

import './Info.css';

class Info extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false
		};
	}

	render() {
		return (
			<div className="info">
				<div className="info-title">
					<h6>Statistics</h6>
				</div>
				<div className="info-field">
					<div className="info-field-item">
						<div className="info-field-item-white">Reviews:</div>
						<div className="info-field-item-orange">13424</div>
					</div>
					<div className="info-field-item">
						<div className="info-field-item-white">Reviews:</div>
						<div className="info-field-item-orange">13424</div>
					</div>
					<div className="info-field-item">
						<div className="info-field-item-white">Reviews:</div>
						<div className="info-field-item-orange">13424</div>
					</div>
					<div className="info-field-item">
						<div className="info-field-item-white">Reviews:</div>
						<div className="info-field-item-orange">13424</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Info;
