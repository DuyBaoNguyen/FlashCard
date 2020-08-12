import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Icon } from '@iconify/react';
import cardIcon from '@iconify/icons-mdi/credit-card-outline';
import downloadIcon from '@iconify/icons-uil/arrow-to-bottom';
import pinIcon from '@iconify/icons-ic/round-pin';
import unpinIcon from '@iconify/icons-ic/round-pin-off';

import Button from '../../Shared/Button/Button';
import Confirm from '../../Shared/Confirm/Confirm';
import * as actions from '../../../store/actions/index';
import withErrorHandler from '../../../hoc/withErrorHandler';
import './PublicDeck.css';

class PublicDeck extends Component {
	state = {
		downloadingConfirmOpen: false
	};

	handleOpenDownloadingConfirm = (event) => {
		event.preventDefault();
		this.setState({ downloadingConfirmOpen: true });
	}

	handleCloseDownloadingConfirm = () => {
		this.setState({ downloadingConfirmOpen: false });
	}

	handleDownloadDeck = (event) => {
		event.preventDefault();
		this.props.onDownloadAdminPublicDeck(this.props.deck.id);
		this.handleCloseDownloadingConfirm();
	};

	handleOpenLocalDeck = (event) => {
		event.preventDefault();
		this.props.history.push({
			pathname: `/decks/${this.props.deck.localDeckId}`,
			state: { backUrl: '/market' }
		});
	}

	handlePinPublicDeck = (event) => {
		event.preventDefault();
		this.props.onPinPublicDeck(this.props.deck.id);
	}

	handleUnpinPublicDeck = (event) => {
		event.preventDefault();
		this.props.onUnpinPublicDeck(this.props.deck.id);
	}

	render() {
		const { deck } = this.props;
		const { downloadingConfirmOpen } = this.state;

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
										<Icon icon={cardIcon} style={{ color: '#ffffff', fontSize: '22px' }} />
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
											onClick={this.handleUnpinPublicDeck}>
											Unpin
										</Button>
									)
									: (
										<Button
											type="button"
											className="pin-btn"
											icon={<Icon icon={pinIcon} />}
											onClick={this.handlePinPublicDeck}>
											Pin
										</Button>
									)
								}
								{deck.localDeckId
									? (
										<Button
											type="button"
											className="open-btn"
											onClick={this.handleOpenLocalDeck}>
											Open
										</Button>
									)
									: (
										<Button
											className="download-btn"
											icon={<Icon icon={downloadIcon} style={{ fontSize: 17 }} />}
											onClick={this.handleOpenDownloadingConfirm} >
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
				<Confirm
					isOpen={downloadingConfirmOpen}
					header="Download"
					message="Do you want to download this deck?"
					confirmColor="#5ad95a"
					onCancel={this.handleCloseDownloadingConfirm}
					onConfirm={this.handleDownloadDeck}>
				</Confirm>
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