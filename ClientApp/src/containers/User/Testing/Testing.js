import React, { Component } from 'react';
import { Progress } from 'react-sweet-progress';
import ReactCardFlip from 'react-card-flip';
import 'react-sweet-progress/lib/style.css';
import './Testing.css';

class Testing extends Component {
	constructor(props) {
		super(props);

		this.state = {
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

		if (this.state.hasError) {
			return <h1>Something went wrong.</h1>;
		}
		return (
			<div className="testing-wrapper">
				<div className="testing-container">
					<div className="testing-progress">
						<Progress percent={12} />
					</div>
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
			</div>
		);
	}
}

export default Testing;
