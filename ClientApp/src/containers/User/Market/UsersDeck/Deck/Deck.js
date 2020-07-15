import React, { Component } from 'react';
import * as actions from '../../../../../store/actions/index';
import withErrorHandler from '../../../../../hoc/withErrorHandler';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Button from '../../../../../components/Shared/Button/Button';
import clockIcon from '@iconify/icons-uil/clock';
import cardIcon from '@iconify/icons-mdi/credit-card-outline';
import succeededCardIcon from '@iconify/icons-mdi/credit-card-check-outline';
import failedCardIcon from '@iconify/icons-mdi/credit-card-remove-outline';

import { Roles } from '../../../../../applicationConstants';
import './Deck.css';

class Deck extends Component {
	onClickDownloadDeck = (id) => {
		this.props.onDownloadAdminPublicDeck(id);
	};
	render() {
		const { deck, profile } = this.props;

		return (
			<div className="deck">
				<Link to={`/decks/${deck.id}`}>
					<div className="wrapper">
						<div
							className="deck-background-color"
							style={{ background: deck.theme }}
						>
							<div className="deck-name">{deck.name}</div>
							<div className="deck-description">{deck.description}</div>
							<div className="deck-info">
								<div className="deck-button">
									<Button
										className="button-download"
										onClick={() => this.onClickDownloadDeck(deck.id)}
									>
										Download
									</Button>
								</div>
							</div>
						</div>
						<div className="deck-background-white-1"></div>
						<div className="deck-background-white-2"></div>
					</div>
				</Link>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		profile: state.home.profile,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onDownloadAdminPublicDeck: (id) =>
			dispatch(actions.downloadAdminPublicDeck(id)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(Deck));
