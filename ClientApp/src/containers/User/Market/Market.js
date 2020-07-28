import React, { Component } from 'react';
import { connect } from 'react-redux';

import Cards from './Cards/Cards';
import Decks from './Decks/Decks';
import UserDecks from './UserDecks/UserDecks';
import withErrorHandler from '../../../hoc/withErrorHandler';
import * as actions from '../../../store/actions';
import './Market.css';

class Market extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePage: 1,
		};
	}

	componentDidMount() {
		const {
			adminPublicDecks,
			userPublicDecks,
			onGetAdminPublicDecks,
			onGetUserPublicDecks
		} = this.props;

		if (adminPublicDecks.length === 0) {
			onGetAdminPublicDecks();
		}
		if (userPublicDecks.length === 0) {
			onGetUserPublicDecks();
		}
	}

	onChangePage = (param) => {
		this.setState({
			activePage: param,
		});
	};

	userTabs = () => {
		if (this.state.activePage === 1) {
			return <Cards />;
		}
		if (this.state.activePage === 2) {
			return <Decks />;
		}
		if (this.state.activePage === 3) {
			return <UserDecks />;
		}
	};

	handlePageChange(pageNumber) {
		this.setState({ activePage: pageNumber });
	}

	render() {
		let activePage = this.userTabs();
		return (
			<div className="market-wrapper">
				<ul className="market-menu">
					<li
						className={this.state.activePage === 1 ? 'market-page-active' : ''}
						onClick={() => this.onChangePage(1)}
					>
						Cards
					</li>
					<li
						className={this.state.activePage === 2 ? 'market-page-active' : ''}
						onClick={() => this.onChangePage(2)}
					>
						Decks
					</li>
					<li
						className={this.state.activePage === 3 ? 'market-page-active' : ''}
						onClick={() => this.onChangePage(3)}
					>
						Decks from Users
					</li>
				</ul>
				<div className="market-panel">{activePage}</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		adminPublicDecks: state.market.adminPublicDecks,
		userPublicDecks: state.market.userPublicDecks
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onGetAdminPublicDecks: () => dispatch(actions.getAdminPublicDecks()),
		onGetUserPublicDecks: () => dispatch(actions.getUserPublicDecks())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Market));
