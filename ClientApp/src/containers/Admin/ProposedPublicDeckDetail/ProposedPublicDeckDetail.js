import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import arrowLeftIcon from '@iconify/icons-uil/angle-left';

import ProposedPublicDeckInfo from '../../../components/Admin/ProposedPublicDeckInfo/ProposedPublicDeckInfo';
import ProposedPublicDeckCards from '../../../components/Admin/ProposedPublicDeckCards/ProposedPublicDeckCards';
import CardInfo from '../../../components/User/CardInfo/CardInfo';
import withErrorHandler from '../../../hoc/withErrorHandler';
import * as actions from '../../../store/actions/index';
import './ProposedPublicDeckDetail.css';

class ProposedPublicDeckDetail extends Component {
  componentDidMount() {
    this.props.onGetDeck(this.props.match.params.deckId);
  }

  componentWillUnmount() {
    this.props.onResetStateInProposedPublicDeckDetailReducer();
  }

  handleCloseCard = () => {
    this.props.onUnselectCard();
  }

  render() {
    const { deck, selectedCard, location } = this.props;

    return (
      <div className="proposed-public-deck-detail">
        <section className="left-section">
          <div className="back-feature">
            <Link to={location.state?.backUrl || '/'}>
              <span className="back-feature-icon">
                <Icon icon={arrowLeftIcon} />
              </span>
              <span className="back-feature-label"> Back</span>
            </Link>
          </div>
          <ProposedPublicDeckInfo deck={deck} showLess={!!selectedCard} />
          {selectedCard && (
            <CardInfo card={selectedCard} closed={this.handleCloseCard} />
          )}
        </section>
        <section className="right-section">
          <ProposedPublicDeckCards />
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    deck: state.proposedPublicDeckDetail.publicDeck,
    selectedCard: state.proposedPublicDeckDetail.selectedCard
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetDeck: (deckId) => dispatch(actions.getProposedPublicDeck(deckId)),
    onUnselectCard: () => dispatch(actions.unselectProposedPublicDeckCard()),
    onResetStateInProposedPublicDeckDetailReducer: () => dispatch(actions.resetStateInProposedPublicDeckDetailReducer())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ProposedPublicDeckDetail));