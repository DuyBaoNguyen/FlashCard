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
						<div className="info-field-item-white">Total cards:</div>
						<div className="info-field-item-orange">
							{this.props.data.totalCards}
						</div>
					</div>
					<div className="info-field-item">
						<div className="info-field-item-white">Failed cards:</div>
						<div className="info-field-item-orange">
							{this.props.data.failedCards}
						</div>
					</div>
					<div className="info-field-item">
						<div className="info-field-item-white">Avarage grade point:</div>
						<div className="info-field-item-orange">
							{this.props.data.gradePointAverage}
						</div>
					</div>
					<hr/>
					<div className="info-field-item">
						<div className="info-field-item-white">Total cards today:</div>
						<div className="info-field-item-orange">
							{this.props.data.totalCardsToday}
						</div>
					</div>
					<div className="info-field-item">
						<div className="info-field-item-white">Failed cards todays:</div>
						<div className="info-field-item-orange">
							{this.props.data.failedCardsToday}
						</div>
					</div>
					<div className="info-field-item">
						<div className="info-field-item-white">
							Avarage grade point today:
						</div>
						<div className="info-field-item-orange">
							{this.props.data.gradePointAverageToday}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Info;
