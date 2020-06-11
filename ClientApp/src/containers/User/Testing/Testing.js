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
			currentVocab: null,
			isStart: false,
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
		this.setState({
			currentVocab: this.getRandomCard(cardList),
		});
		console.log(isDelete, id);
	};

	render() {
		let testingField = (
			<>
				<div className="testing-progress">
					<Progress percent={12} />
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
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetCardsInDeck: (id) => dispatch(actions.getCardsInDeck(id)),
		onUpdateRandomCard: (currentVocab) =>
			dispatch(actions.updateRandomCard(currentVocab)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(Testing));
