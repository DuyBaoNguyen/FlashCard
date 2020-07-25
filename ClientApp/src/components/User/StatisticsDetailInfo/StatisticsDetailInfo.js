import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from '@iconify/react';
import deckIcon from '@iconify/icons-uil/layer-group';
import timeIcon from '@iconify/icons-uil/clock';
import cardIcon from '@iconify/icons-mdi/credit-card-check-outline';

import './StatisticsDetailInfo.css';

class StatisticsDetailInfo extends Component {
  render() {
    const { practice, rememberedCards } = this.props;
    return (
      <div className="statistics-detail-info">
        {!!practice
          ? (
            <>
              <div className="statistics-detail-info-header">Practice</div>
              <div className="statistics-detail">
                <div className="statistics-field">
                  <span>
                    <Icon icon={timeIcon} color="#aaa" style={{ fontSize: 18 }} />
                  </span>
                  Date
                </div>
                <div className="statistics-value">
                  {new Date(practice.dateTime).toDateString()}
                  &nbsp;-&nbsp;
                  {new Date(practice.dateTime).toLocaleTimeString()}
                </div>
              </div>
              <div className="statistics-detail">
                <div className="statistics-field">
                  <span>
                    <Icon icon={deckIcon} color="#aaa" style={{ fontSize: 18 }} />
                  </span>
                  Deck
                </div>
                <div className="statistics-value">{practice.deck.name}</div>
              </div>
              <div className="statistics-detail">
                <div className="statistics-field">
                  <span>
                    <Icon icon={cardIcon} color="#aaa" style={{ fontSize: 18 }} />
                  </span>
                  Remembered Cards
                </div>
                <div className="statistics-value">
                  {practice.succeededCards.length} / {practice.succeededCards.length + practice.failedCards.length}
                </div>
              </div>
              <div className="practiced-cards-header">Remembered Cards</div>
              <div className="practiced-cards">
                {practice.succeededCards.length > 0
                  ? (
                    <>
                      {practice.succeededCards.map((card, index) => (
                        <span key={index} className="card remembered-card">{card}</span>
                      ))}
                    </>
                  )
                  : (
                    <div className="no-cards-notification">There are no remembered cards</div>
                  )
                }
              </div>
              <div className="practiced-cards-header">Not Remembered Cards</div>
              <div className="practiced-cards">
                {practice.failedCards.length > 0
                  ? (
                    <>
                      {practice.failedCards.map((card, index) => (
                        <span key={index} className="card not-remembered-card">{card}</span>
                      ))}
                    </>
                  )
                  : (
                    <div className="no-cards-notification">There are no not remembered cards</div>
                  )
                }
              </div>
              <div className="practiced-cards-header">First Time Remembered Cards</div>
              <div className="practiced-cards">
                {rememberedCards.filter(card => practice.succeededCards.includes(card)).length > 0
                  ? (
                    <>
                      {rememberedCards
                        .filter(card => practice.succeededCards.includes(card))
                        .map((card, index) => (
                          <span key={index} className="card remembered-card">{card}</span>
                        ))
                      }
                    </>
                  )
                  : (
                    <div className="no-cards-notification">There are no first time remembered cards</div>
                  )
                }

              </div>
            </>
          )
          : (
            <div className="text-notification">Click a practice to see more information!</div>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  practice: state.statistics.selectedPractice,
  rememberedCards: state.statistics.rememberedCards
});

export default connect(mapStateToProps)(StatisticsDetailInfo);