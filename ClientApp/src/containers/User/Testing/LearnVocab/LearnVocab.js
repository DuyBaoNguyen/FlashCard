import React, { Component } from 'react';
import ReactCardFlip from 'react-card-flip';
// import { connect } from 'react-redux';
// import * as actions from '../../../store/actions';
// import withErrorHandler from '../../../hoc/withErrorHandler';

import './LearnVocab.css';

class LearnVocab extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hasError: false,
			isFlipped: false,
		};
	}

	showNextButton = () => {
		this.setState({
			isFlipped: !this.state.isFlipped,
		});
	};

	render() {
		let buttons = (
			<>
				<div className="testing-button-dont-remember">
					<button onClick={() => this.showNextButton()}>Don't Remember</button>
				</div>
				<div className="testing-button-remember">
					<button>Remember</button>
				</div>
			</>
		);

		let nextButton = (
			<>
				<div className="testing-button-next">
					<button onClick={() => this.showNextButton()}>Next</button>
				</div>
			</>
		);

		let front = <div className="testing-card">front</div>;
		let back = <div className="testing-card">back</div>;
		return (
			<div className="learn-wrapper">
				<ReactCardFlip
					isFlipped={this.state.isFlipped}
					flipDirection="vertical"
				>
					{front}
					{back}
				</ReactCardFlip>
				<div className="testing-button">
					{this.state.isFlipped !== true ? buttons : nextButton}
				</div>
			</div>
		);
	}
}

export default LearnVocab;
