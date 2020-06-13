import React, { Component } from 'react';
import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';
import LearnVocab from './LearnVocab/LearnVocab';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import withErrorHandler from '../../../hoc/withErrorHandler';
import './Testing.css';

class Testing extends Component {
	constructor(props) {
		super(props);

		this.state = {
			finish: false,
			process: 0,
			listLength: 1,
			currentVocab: null,
			savedVocab: [],
			isStart: false,
			succeededCardIds: [],
			failedCardIds: [],
		};
	}

	getRandomCard = (cardList) => {
		return cardList[Math.floor(Math.random() * cardList.length)];
	};

	componentWillMount() {
		this.props.onGetCardsInDeck(this.props.match.params.deckId);
	}

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
		let process = (
			(this.state.savedVocab.length /
				(this.props.cardList.length + this.state.savedVocab.length)) *
			100
		).toFixed(2);
		// Save word that user has just learned in a new array
		newSavedVocab.push(cardList.filter((x) => x.id === id));

		if (isDelete === true) {
			newSucceededCardIds.push(this.state.currentVocab?.id);
			newSucceededCardIds = newSucceededCardIds.filter(Number);
			newFailedCardIds = newFailedCardIds.filter(Number);

			// Remove word from list
			currentVocabList.splice(
				cardList.findIndex((x) => x.id === id),
				1
			);

			this.props.onUpdateCardsInDeck(currentVocabList);

			this.setState({
				process: process,
				currentVocab: this.getRandomCard(currentVocabList),
				savedVocab: newSavedVocab,
				succeededCardIds: newSucceededCardIds,
			});
		} else {
			newFailedCardIds.push(this.state.currentVocab?.id);
			this.props.onUpdateCardsInDeck(currentVocabList);
			this.setState({
				currentVocab: this.getRandomCard(cardList),
				failedCardIds: newFailedCardIds,
			});
		}
		// console.log(
		// 	currentVocabList.length,
		// 	this.props.cardList.length + this.state.savedVocab.length
		// );
		if (currentVocabList.length === 0) {
			console.log('Call API');
			this.isFinish(currentVocabList, newSucceededCardIds, newFailedCardIds);
		}
	};

	isFinish = (currentVocabList, newSucceededCardIds, newFailedCardIds) => {
		let formattedNewSucceededCardIds = newSucceededCardIds.filter(
			(x) => !newFailedCardIds.includes(x)
		);
		console.log(formattedNewSucceededCardIds);
		let date = new Date();

		formattedNewSucceededCardIds = this.unique(formattedNewSucceededCardIds);
		newFailedCardIds = this.unique(newFailedCardIds);
		console.log(formattedNewSucceededCardIds, newFailedCardIds);
		this.props.onSendTestResult(
			this.props.match.params.deckId,
			date.toISOString(),
			newSucceededCardIds,
			formattedNewSucceededCardIds
		);
	};

	unique = (array) => {
		return Array.from(new Set(array));
	};

	render() {
		let testingField = (
			<>
				<div className="testing-progress">
					<Progress percent={this.state.process} />
				</div>
				<LearnVocab
					onNext={this.onNext}
					currentVocab={this.state.currentVocab}
				/>
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
					Good luck!
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
