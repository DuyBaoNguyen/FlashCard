import React, { Component } from 'react';
import { connect } from 'react-redux';

import withErrorHandler from '../../../hoc/withErrorHandler';
import * as actions from '../../../store/actions/index';
import Profile from '../../../components/User/Profile/Profile';

import Statistics from '../../../components/User/Statistics/Statistics';
import DeckWrapper from '../../../components/User/DeckWrapper/DeckWrapper';
import './Home.css';

class Home extends Component {
	componentDidMount() {
		this.props.onGetStatistics();
	}

	render() {
		return (
			<div className="home">
				<div className="home-left">
					<Profile profile={this.props.profile}/>
					<Statistics
						percentPracticedCardsChartData={
							this.props.percentPracticedCardsStatistics
						}
						amountRememberedCardsChartData={
							this.props.amountRememberedCardsStatistics
						}
					/>
				</div>
				<div className="home-right">
					<DeckWrapper className="deck-wrapper" />
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
    profile: state.home.profile,
		percentPracticedCardsStatistics: state.home.percentPracticedCardsStatistics,
		amountRememberedCardsStatistics: state.home.amountRememberedCardsStatistics,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
    onGetProfile: () => dispatch(actions.getProfile()),
		onGetStatistics: () => dispatch(actions.getStatistics()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(Home));
