import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Icon } from '@iconify/react';
import cardIcon from '@iconify/icons-mdi/credit-card-check-outline';

import withErrorHandler from '../../../hoc/withErrorHandler';
import * as actions from '../../../store/actions';
import './StatisticsInfo.css';

class StatisticsInfo extends Component {
  componentDidMount() {
    const userId = this.props.match.params.userId;
    if (userId) {
      this.props.onGetCurrentUserStatistics(userId);
      return;
    }

    const deckId = this.props.match.params.deckId;
    if (deckId) {
      this.props.onGetDeckStatistics(deckId);
    } else {
      this.props.onGetStatistics();
    }
  }

  componentDidUpdate() {
    const { 
      generalStatistics, 
      deckStatistics, 
      currentUserStatistics,
      match, 
      selectedPractice,
      onSelectPractice
    } = this.props;
    let statistics;

    if (match.params.userId) {
      statistics = currentUserStatistics;
    } else if (match.params.deckId) {
      statistics = deckStatistics;
    } else {
      statistics = generalStatistics;
    }

    if (statistics && !selectedPractice) {
      const now = new Date();
      for (let item of statistics) {
        if (item.tests && new Date(item.dateTime).getDate() === now.getDate()) {
          onSelectPractice(item.tests[item.tests.length - 1], item.rememberedCards);
        }
      }
    }
  }

  componentWillUnmount() {
    this.props.onUnselectPractice();
  }

  handleSelectPractice = (practice, rememberedCards) => {
    this.props.onSelectPractice(practice, rememberedCards);
  }

  render() {
    const { 
      generalStatistics, 
      deckStatistics, 
      currentUserStatistics,
      match 
    } = this.props;
    let statistics;

    if (match.params.userId) {
      statistics = currentUserStatistics;
    } else if (match.params.deckId) {
      statistics = deckStatistics;
    } else {
      statistics = generalStatistics;
    }

    return (
      <div className="statistics-info">
        <div className="statistics-info-header">Statistics</div>
        <div className="statistics-items">
          {statistics?.map((item, index) => {
            const isToday = new Date(item.dateTime).getDate() === new Date().getDate();
            const dateLabelClasses = ['date-label'];
            if (isToday) {
              dateLabelClasses.push('date-label-today');
            }
            return (
              <div key={index}>
                <p className={dateLabelClasses.join(' ')}>
                  {new Date(item.dateTime).toDateString()}
                  {isToday && (
                    <span> - Today</span>
                  )}
                  <span className="bottom-line"></span>
                </p>
                {item.tests?.map((test, index) => (
                  <div
                    key={index} 
                    className="practice"
                    onClick={() => this.handleSelectPractice(test, item.rememberedCards)}>
                    <p className="practice-datetime">{new Date(test.dateTime).toLocaleTimeString()}</p>
                    <p className="deck-name">{test.deck.name}</p>
                    <div className="remembered-cards">
                      <span>
                        <Icon icon={cardIcon} color="#aaa" style={{ fontSize: 18 }} />
                      </span>
                      <span>{test.succeededCards.length} / {test.succeededCards.length + test.failedCards.length}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  generalStatistics: state.home.statistics,
  deckStatistics: state.deckDetail.statistics,
  currentUserStatistics: state.usersmanagement.currentUserStatistics,
  selectedPractice: state.statistics.selectPractice
});

const mapDispatchToProps = dispatch => ({
  onGetStatistics: () => dispatch(actions.getStatistics()),
  onGetDeckStatistics: (deckId) => dispatch(actions.getDeckStatistics(deckId)),
  onGetCurrentUserStatistics: (userId) => dispatch(actions.getCurrentUserStatistics(userId)),
  onSelectPractice: (practice, rememberedCards) => dispatch(actions.selectPractice(practice, rememberedCards)),
  onUnselectPractice: () => dispatch(actions.unselectPractice())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(StatisticsInfo)));