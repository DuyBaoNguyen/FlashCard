import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Home.css';
import withErrorHandler from '../../../hoc/withErrorHandler';
import * as actions from '../../../store/actions/index';
import Statistics from '../../../components/User/Statistics/Statistics';
import DeckWrapper from '../../../components/User/DeckWrapper/DeckWrapper';

class Home extends Component {
	render() {
    // console.log(this.props.decks);
		return (
			<div className="home">
				{/* <p>Count: {this.props.counter1}</p>
        <p>Count: {this.props.counter2}</p>
        <button onClick={() => this.props.onIncreaseCounter(5) }>Increase</button>
        <button onClick={() => this.props.onDecreaseCounter(5)}>Decrease</button>
        <button onClick={this.props.onIncreaseCounter2}>Increase2</button>
        <button onClick={this.props.onDecreaseCounter2}>Decrease2</button> */}
				<Statistics />
				<DeckWrapper />
			</div>
		);
	}
}

Home.propTypes = {
	// bla: PropTypes.string,
};

Home.defaultProps = {
	// bla: 'test',
};

// const mapStateToProps = (state) => {
// 	return {
// 		decks: state.home.decks,
// 	};
// };

// const mapDispatchToProps = (dispatch) => {
// 	return {
// 		// onIncreaseCounter: (value) => dispatch(actions.increase(value)),
// 		// onDecreaseCounter: (value) =>
// 		// 	dispatch({
// 		// 		type: 'DECREASE',
// 		// 		value: value,
// 		// 	}),
// 		// onIncreaseCounter2: () =>
// 		// 	dispatch({
// 		// 		type: 'INCREASE2',
// 		// 	}),
// 		// onDecreaseCounter2: () =>
// 		// 	dispatch({
// 		// 		type: 'DECREASE2',
// 		// 	}),
// 		onGetDecks: () => dispatch(actions.getDecks()),
// 	};
// };

export default withErrorHandler(Home);
