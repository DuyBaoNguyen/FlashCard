import React, { Component } from 'react';
import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';
import LearnVocab from './LearnVocab/LearnVocab';
import Result from './Result/Result';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import withErrorHandler from '../../../hoc/withErrorHandler';
import './Testing.css';
import Multiple from './Multiple/Multiple';

class Testing extends Component {
	constructor(props) {
		super(props);

		this.state = {
			multipleCount: 4,
			isMultiple: false,
			isFinish: false,
			process: 0,
			listLength: 1,
			currentVocab: null,
			savedVocab: [],
			isStart: false,
			succeededCardIds: [],
			failedCardIds: [],
			succeededCardsLength: null,
			failedCardsLength: null,
		};
	}

	getRandomCard = (cardList) => {
		return cardList[Math.floor(Math.random() * cardList.length)];
	};

	componentWillMount() {
		this.props.onGetCardsInDeck(this.props.match.params.deckId);
	}

	isDisplayMultipleQuestion = () => {
		let { multipleCount } = this.state;
		if (multipleCount === 0) {
			return true;
		} else {
			return false;
		}
	};

	onStart = () => {
		this.setState({ isStart: true });
	};

	onNext = (isDelete, id) => {
		let { cardList } = this.props;
		let { savedVocab, succeededCardIds, failedCardIds } = this.state;

		let newSavedVocab = [...savedVocab];
		let currentVocabList = [...cardList];

		let newSucceededCardIds = [...succeededCardIds];
		let newFailedCardIds = [...failedCardIds];
		console.log(cardList);
		console.log(currentVocabList);
		let process = (
			(this.state.savedVocab.length /
				(currentVocabList.length + this.state.savedVocab.length - 1)) *
			100
		).toFixed(0);

		// Save word that user has just learned in a new array
		newSavedVocab.push(cardList.filter((x) => x.id === id));

		if (isDelete === true) {
			//Multiple question counter
			if (!this.isDisplayMultipleQuestion()) {
				this.setState({
					multipleCount: this.state.multipleCount - 1,
					isMultiple: false,
				});
			} else {
				this.setState({
					multipleCount: 4,
					isMultiple: true,
				});
			}
			newSucceededCardIds.push(this.state.currentVocab?.id);
			newSucceededCardIds = newSucceededCardIds.filter(Number);
			newFailedCardIds = newFailedCardIds.filter(Number);

			// Remove word from list
			if (id !== undefined) {
				cardList.splice(
					currentVocabList.findIndex((x) => x.id === id),
					1
				);
			}

			this.props.onUpdateCardsInDeck(cardList);

			this.setState({
				process: process,
				currentVocab: this.getRandomCard(cardList),
				savedVocab: newSavedVocab,
				succeededCardIds: newSucceededCardIds,
			});
		} else {
			newFailedCardIds.push(this.state.currentVocab?.id);
			this.props.onUpdateCardsInDeck(cardList);
			this.setState({
				currentVocab: this.getRandomCard(cardList),
				failedCardIds: newFailedCardIds,
			});
		}
		if (cardList.length === 0) {
			this.isFinish(currentVocabList, newSucceededCardIds, newFailedCardIds);
			this.setState({
				isFinish: true,
			});
		}
	};

	isFinish = (cardList, newSucceededCardIds, newFailedCardIds) => {
		let formattedNewSucceededCardIds = newSucceededCardIds.filter(
			(x) => !newFailedCardIds.includes(x)
		);
		let date = new Date();

		formattedNewSucceededCardIds = this.unique(formattedNewSucceededCardIds);
		newFailedCardIds = this.unique(newFailedCardIds);
		this.saveResult(
			formattedNewSucceededCardIds.length,
			newFailedCardIds.length
		);
		this.props.onSendTestResult(
			this.props.match.params.deckId,
			date.toISOString(),
			formattedNewSucceededCardIds,
			newFailedCardIds
		);
	};

	saveResult = (succeededCardsLength, failedCardsLength) => {
		this.setState({
			succeededCardsLength: succeededCardsLength,
			failedCardsLength: failedCardsLength,
		});
	};

	unique = (array) => {
		return Array.from(new Set(array));
	};

	onChangeMultiple = () => {
		this.setState({
			isMultiple: false,
		});
	};

	testingFieldOptions = () => {
		if (this.state.isFinish === true) {
			return (
				<Result
					succeeded={this.state.succeededCardsLength}
					failed={this.state.failedCardsLength}
				/>
			);
		} else {
			if (this.state.isMultiple === true) {
				return (
					<Multiple
						onChangeMultiple={this.onChangeMultiple}
						cardList={this.state.savedVocab}
					/>
				);
			} else {
				return (
					<LearnVocab
						onNext={this.onNext}
						currentVocab={this.state.currentVocab}
					/>
				);
			}
		}
	};

	render() {
		let testingOption = this.testingFieldOptions();
		let testingField = (
			<>
				<div className="testing-progress">
					<Progress percent={this.state.process} />
					{testingOption}
				</div>
			</>
		);
		let startButton = (
			<div className="testing-instruction">
				<p>
					Press <b style={{ color: '#9EACF4' }}>Start</b> button below to start
					the lesson.
					<br />
					Once you start, please <b style={{ color: '#9EACF4' }}>
						don't quit{' '}
					</b>{' '}
					because the result will only be submitted when you finish the lesson.
					<br />
					<br />
					<br />
					Good luck! 💪🏻💪🏻💪🏻
				</p>
				<div className="testing-button-start">
					<button onClick={() => this.onStart()}>Start</button>
				</div>
			</div>
		);
		return (
			<div className="testing-wrapper">
				<div className="testing-container">
					{this.state.isStart === true ? testingField : startButton}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		cardList: state.testing.cardList,
		currentVocab: state.testing.currentVocab,
		succeededCardIds: state.testing.succeededCardIds,
		failedCardIds: state.testing.failedCardIds,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetCardsInDeck: (id) => dispatch(actions.getCardsInDeck(id)),
		onUpdateRandomCard: (currentVocab) =>
			dispatch(actions.updateRandomCard(currentVocab)),
		onUpdateCardsInDeck: (currentVocabList) =>
			dispatch(actions.updateCardsInDeck(currentVocabList)),
		onSendTestResult: (id, datetime, succeededCardIds, failedCardIds) =>
			dispatch(
				actions.sendTestResult(id, datetime, succeededCardIds, failedCardIds)
			),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(Testing));
