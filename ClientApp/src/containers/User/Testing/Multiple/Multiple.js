import React, { Component } from 'react';
import { Animated } from 'react-animated-css';
import './Multiple.css';

class Multiple extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isCorrect: true,
			isShowAnswer: false,
			multipleCards: [...this.props.cardList],
			rightAnswers: [],
		};
	}

	getRandomCard = (cardList) => {
		return cardList[Math.floor(Math.random() * cardList.length)];
	};

	onClickRight = () => {
		this.setState({
			isCorrect: true,
			isShowAnswer: true,
		});
	};

	onClickWrong = () => {
		this.setState({
			isCorrect: false,
			isShowAnswer: true,
		});
	};

	onChangeMultiple = () => {
		this.props.onChangeMultiple();
	}

	render() {
		let answers = [];
		let answerField;
		let { multipleCards } = this.state;
		let newCards = [
			...multipleCards?.flat().sort(function (a, b) {
				return 0.5 - Math.random();
			}),
		];
		let rightCard = newCards[0].front;
		let rightAnswer = newCards[0].backs[0].meaning;
		let wrongAnswer1 = newCards[1].backs[0].meaning;
		let wrongAnswer2 = newCards[2].backs[0].meaning;

		console.log(rightAnswer, wrongAnswer1, wrongAnswer2);
		answers.push(
			<div className="multiple-right-answer answer" onClick={this.onClickRight}>
				{rightAnswer}
			</div>
		);
		answers.push(
			<div className="multiple-wrong-answer answer" onClick={this.onClickWrong}>
				{wrongAnswer1}
			</div>
		);
		answers.push(
			<div className="multiple-wrong-answer answer" onClick={this.onClickWrong}>
				{wrongAnswer2}
			</div>
		);

		if (answers.length !== 0) {
			answers = [
				...answers.sort(function (a, b) {
					return 0.5 - Math.random();
				}),
			];
			answerField = answers.map((answer) => answer);
		}

		let multipleQuestion = (
			<>
				{' '}
				<div className="multiple-instruction">
					Choose correct meaning of card below
				</div>
				<div className="multiple-card">
					<div className="multiple-card-layer-1">
						{rightCard !== undefined ? rightCard : 'No'}
					</div>
					<div className="multiple-card-layer-2"></div>
					<div className="multiple-card-layer-3"></div>
				</div>
				<div className="multiple-answers">{answerField}</div>
			</>
		);

		let resultMultipleQuestion = (
			<div className="multiple-result">
				<Animated animationIn="bounceIn" animationInDelay="0" isVisible={true}>
					{this.state.isCorrect ? (
						<p style={{ color: '#52c41a' }}>Correct!</p>
					) : (
						<p style={{ color: '#fe656d' }}>Incorrect!</p>
					)}
				</Animated>
				<div className="multiple-button-next">
					<button onClick={() => this.onChangeMultiple()}>Next</button>
				</div>
			</div>
		);

		return (
			<div className="multiple-wrapper">
				<div className="multiple-container">
					{this.state.isShowAnswer ? resultMultipleQuestion : multipleQuestion}
				</div>
			</div>
		);
	}
}

export default Multiple;
