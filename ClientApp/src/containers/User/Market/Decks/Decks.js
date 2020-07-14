import React, { Component } from 'react';
import { connect } from 'react-redux';
import withErrorHandler from '../../../../hoc/withErrorHandler';
import * as actions from '../../../../store/actions/index';
import './Decks.css';

class Decks extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePage: 1,
		};
	}

	componentDidMount() {
		this.props.onGetAdminPublicDecks();
	}

	render() {
		console.log(this.props.adminPublicDecks);
		return <div className="market-decks-wrapper">asdas</div>;
	}
}

const mapStateToProps = (state) => {
	return {
		adminPublicDecks: state.market.adminPublicDecks,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onGetAdminPublicDecks: () => dispatch(actions.getAdminPublicDecks()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(Decks));
