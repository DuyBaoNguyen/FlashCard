import React, { Component } from 'react';
import { Animated } from 'react-animated-css';
import { connect } from 'react-redux';
import { Icon } from '@iconify/react';
import arrowLeftIcon from '@iconify/icons-uil/angle-left';
import * as actions from '../../../store/actions';
import { Link } from 'react-router-dom';
import withErrorHandler from '../../../hoc/withErrorHandler';
import './MatchCard.css';

class MatchCard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isFinish: false,
			currentSelectCards: [],
			matchedCards: [],
		};
	}

	onSelectCard = (card) => {
		let { cardList, currentSelectCards, matchedCards } = this.props;
		currentSelectCards.push(card);
		cardList[cardList.indexOf(card)].isSelected = true;
		this.setState({
			isFinish: false,
		});
		console.log(cardList, currentSelectCards, matchedCards);

		if (currentSelectCards.length === 2) {
			if (this.compareCards(currentSelectCards)) {
				matchedCards.push(currentSelectCards[0]);
				matchedCards.push(currentSelectCards[1]);
				cardList[cardList.indexOf(currentSelectCards[0])].isMatched = true;
				cardList[cardList.indexOf(currentSelectCards[1])].isMatched = true;
				cardList[cardList.indexOf(currentSelectCards[0])].isSelected = false;
				cardList[cardList.indexOf(currentSelectCards[1])].isSelected = false;

				currentSelectCards = [];
			} else {
				cardList[cardList.indexOf(currentSelectCards[0])].isSelected = false;
				cardList[cardList.indexOf(currentSelectCards[1])].isSelected = false;
				currentSelectCards[0].isMatched = false;
				currentSelectCards[1].isMatched = false;
				currentSelectCards = [];
			}
			this.checkFinish(cardList, matchedCards);
		}
		this.props.onUpdateMatchCards(cardList, currentSelectCards, matchedCards);
	};

	checkFinish = (cardList, matchedCards) => {
		if (cardList.length === matchedCards.length) {
			this.setState({
				isFinish: true,
			});
		}
	};

	compareCards = (array) => {
		return array[0].type === array[1].type &&
			array[0].content !== array[1].content
			? true
			: false;
	};

	componentWillMount() {
		this.props.onGetMatchCards(this.props.match.params.deckId);
	}

	render() {
		let isNotMatched = {
			background: '#FFFFFF',
		};

		let isMatched = {
			visibility: 'hidden',
		};

		let isSelected = {
			fontSize: '20px',
			color: '#9EACF4',
		};

		let isNotSelected = {
			color: '#535353',
		};

		let cardsDisplay = this.props.cardList?.map((card, index) => {
			return (
				<div
					className="match-card"
					style={card.isMatched === false ? isNotMatched : isMatched}
					onClick={() => this.onSelectCard(card)}
				>
					<p style={card.isSelected === false ? isNotSelected : isSelected}>
						{card.content}
					</p>
					{/* <p>{card.content}</p> */}
				</div>
			);
		});

		let matchContainer = (
			<div className="match-container">
				<div className="match-back">
					<Link to={`/decks/${this.props.match.params.deckId}`}>
						<div className="match-back-feature">
							<span className="match-back-feature-icon">
								<Icon icon={arrowLeftIcon} />
							</span>
							<span className="match-back-feature-label"> Back</span>
						</div>
					</Link>
				</div>
				<div className="match-cards">{cardsDisplay}</div>
			</div>
		);

		let result = (
			<div className="match-result">
				<Animated animationIn="bounceIn" animationInDelay="0" isVisible={true}>
					<p className="match-result-header" style={{ fontSize: '40px' }}>
						<span role="img" aria-label="clap">👏🏻</span>
						<span role="img" aria-label="clap">👏🏻</span>
						<span role="img" aria-label="clap">👏🏻</span>
					</p>
				</Animated>
				<Animated
					animationIn="bounceIn"
					animationInDelay="300"
					isVisible={true}
				>
					<p className="match-result-header">
						You have finished the match cards game!!!
					</p>
				</Animated>
				<br />
				<Link to={`/decks/${this.props.match.params.deckId}`}>
					<button>Back to deck</button>
				</Link>
			</div>
		);

		return (
			<div className="match-wrapper">
				{!this.state.isFinish ? matchContainer : result}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		cardList: state.matchCard.cardList,
		currentSelectCards: state.matchCard.currentSelectCards,
		matchedCards: state.matchCard.matchedCards,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetMatchCards: (id) => dispatch(actions.getMatchCards(id)),
		onUpdateMatchCards: (cardList, currentSelectCards, matchedCards) =>
			dispatch(
				actions.updateMatchCards(cardList, currentSelectCards, matchedCards)
			),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(MatchCard));
