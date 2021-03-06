import React, { Component } from 'react';
import { connect } from 'react-redux';

import withErrorHandler from '../../../hoc/withErrorHandler';
import CardInfo from '../../../components/User/CardInfo/CardInfo';
import CardsList from '../../../components/User/CardsList/CardsList';
import * as actions from '../../../store/actions';
import './Cards.css';

class Cards extends Component {
  componentWillUnmount() {
    this.props.onResetStateInCardsReducer();
  }

  render() {
    return (
      <div className="cards-wrapper">
        <section className="left-section">
          <CardInfo unableClose card={this.props.selectedCard} />
        </section>
        <section className="right-section">
          <CardsList />
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedCard: state.cards.selectedCard
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onResetStateInCardsReducer: () => dispatch(actions.resetStateInCardsReducer())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Cards));