import React, { Component } from 'react';
import { connect } from 'react-redux';

import withErrorHandler from '../../../hoc/withErrorHandler';
import * as actions from '../../../store/actions/index';
import Profile from '../../../components/User/Profile/Profile';

import Statistics from '../../../components/User/Statistics/Statistics';
import DeckWrapper from '../../../components/User/DeckWrapper/DeckWrapper';
import Shortcuts from '../../../components/User/Shortcuts/Shortcuts';
import { Roles } from '../../../applicationConstants';
import './Home.css';

class Home extends Component {
	componentDidMount() {
		this.props.onGetStatistics();
		if (this.props.originalShortcuts.length === 0) {
			this.props.onGetShortcuts();
		}
	}

	render() {
		const { 
			profile,
			percentPracticedCardsStatistics,
			amountRememberedCardsStatistics,
			tab
		} = this.props;

		return (
			<div className="home">
				<section className="left-section">
					<Profile profile={profile} />
					{profile?.role === Roles.User && (
						<Statistics
						percentPracticedCardsChartData={percentPracticedCardsStatistics}
						amountRememberedCardsChartData={amountRememberedCardsStatistics} />
					)}
				</section>
				<section className="right-section">
					{tab === 1
						? (
							<DeckWrapper />
						)	
						: (
							<Shortcuts />
						)
					}
				</section>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		profile: state.home.profile,
		percentPracticedCardsStatistics: state.home.percentPracticedCardsStatistics,
		amountRememberedCardsStatistics: state.home.amountRememberedCardsStatistics,
		tab: state.home.tab,
		originalShortcuts: state.home.originalShortcuts
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetProfile: () => dispatch(actions.getProfile()),
		onGetStatistics: () => dispatch(actions.getStatistics()),
		onGetShortcuts: () => dispatch(actions.getShortcuts())
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(Home));
