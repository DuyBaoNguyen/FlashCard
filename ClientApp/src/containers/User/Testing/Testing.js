import React, { Component } from 'react';
import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';
import LearnVocab from './LearnVocab/LearnVocab';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './Testing.css';

class Testing extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isFlipped: false,
		};
	}

	componentDidMount() {
		this.props.onGetCardsInDeck(this.props.match.params.deckId);
	}
	render() {
		return (
			<div className="testing-wrapper">
				<div className="testing-container">
					<div className="testing-progress">
						<Progress percent={12} />
					</div>
					<LearnVocab />
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		cardList: state.testing.cardList,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetCardsInDeck: (id) => dispatch(actions.getCardsInDeck(id)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Testing);
