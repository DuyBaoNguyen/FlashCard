import React, { Component } from 'react';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler';
import * as actions from '../../../store/actions/index';
import CardsTable from './CardsTable/CardsTable';
import Button from '../../../components/Shared/Button/Button';
import './CardsProposal.css';

class CardsProposal extends Component {
	render() {
		return (
			<div className="cards-proposal-wrapper">
				<div className="cards-proposal-left">
					<CardsTable />
				</div>
				<div className="cards-proposal-right">
					<div className="cards-proposal-back">
						<div className="cards-proposal-back-admin">
							<div className="cards-proposal-back-title">Title</div>
							<div className="cards-proposal-back-card">asd</div>
							<div className="cards-proposal-back-card">asd</div>
						</div>
						<div className="cards-proposal-back-user">
							<div className="cards-proposal-back-title">From user</div>
							<div className="cards-proposal-back-card">asd</div>
							<div className="cards-proposal-back-card">asd</div>
						</div>
					</div>
					<div className="cards-proposal-buttons">
						<Button className="cards-proposal-button-approve">Approve</Button>
						<Button className="cards-proposal-button-decline">Decline</Button>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		usersList: state.usersmanagement.usersList,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetUsers: () => dispatch(actions.getUsers()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(CardsProposal));
