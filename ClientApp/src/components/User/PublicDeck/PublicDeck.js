import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Icon } from '@iconify/react';
import cardIcon from '@iconify/icons-mdi/credit-card-outline';
import downloadIcon from '@iconify/icons-uil/arrow-to-bottom';
import pinIcon from '@iconify/icons-mdi/pin-outline';
import unpinIcon from '@iconify/icons-mdi/pin-off-outline';

import Button from '../../Shared/Button/Button';
import * as actions from '../../../store/actions/index';
import withErrorHandler from '../../../hoc/withErrorHandler';
import './PublicDeck.css';

class PublicDeck extends Component {
	onClickDownloadDeck = (event, id) => {
		event.preventDefault();
		this.props.onDownloadAdminPublicDeck(id);
	};

	handleOpenLocalDeck = (event, deckId) => {
		event.preventDefault();
		this.props.history.push({ pathname: `/decks/${deckId}`, state: { backUrl: '/market' } });
	}

	handlePinPublicDeck = (event, deckId) => {
		event.preventDefault();
		this.props.onPinPublicDeck(deckId);
	}

	handleUnpinPublicDeck = (event, deckId) => {
		event.preventDefault();
		this.props.onUnpinPublicDeck(deckId);
	}

	render() {
		const { deck } = this.props;

		return (
			<div className="deck">
				<Link to={{ pathname: `/publicdecks/${deck.id}`, state: { backUrl: '/market' } }}>
					<div className="wrapper">
						<div
							className="deck-background-color"
							style={{ background: deck.theme }}
						>
							<div className="deck-name">{deck.name}</div>
							<div className="deck-description">{deck.description}</div>
							<div className="deck-info">
								<div className="deck-info-value-container">
									<div className="deck-info-value">
										<Icon icon={cardIcon} style={{ color: '#ffffff', fontSize: '24px' }} />
										<p>{deck.totalCards}</p>
									</div>
								</div>
							</div>
							<div className="public-deck-features">
								{deck.pinned
									? (
										<Button
											type="button"
											className="unpin-btn"
											icon={<Icon icon={unpinIcon} />}
											onClick={(event) => this.handleUnpinPublicDeck(event, deck.id)}>
											Unpin
										</Button>
									)
									: (
										<Button
											type="button"
											className="pin-btn"
											icon={<Icon icon={pinIcon} />}
											onClick={(event) => this.handlePinPublicDeck(event, deck.id)}>
											Pin
										</Button>
									)
								}
								{deck.localDeckId
									? (
										<Button
											type="button"
											className="open-btn"
											onClick={(event) => this.handleOpenLocalDeck(event, deck.localDeckId)}>
											Open
										</Button>
									)
									: (
										<Button
											className="download-btn"
											icon={<Icon icon={downloadIcon} />}
											onClick={(event) => this.onClickDownloadDeck(event, deck.id)} >
											Download
										</Button>
									)
								}
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

const mapDispatchToProps = (dispatch) => {
	return {
		onDownloadAdminPublicDeck: (id) => dispatch(actions.downloadAdminPublicDeck(id)),
		onPinPublicDeck: (deckId) => dispatch(actions.pinPublicDeck(deckId)),
		onUnpinPublicDeck: (deckId) => dispatch(actions.unpinPublicDeck(deckId))
	};
};

export default withRouter(connect(null, mapDispatchToProps)(withErrorHandler(PublicDeck)));