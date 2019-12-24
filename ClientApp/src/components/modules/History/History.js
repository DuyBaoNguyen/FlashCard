import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './History.css';

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
  }

  render() {
    return (
      <div className="history">
        <div className="history-title">
          <h6>History</h6>
        </div>
        <div className="history-table">
          <table className="table">
            <thead>
              <tr>
                <th>Deck</th>
                <th>Percent</th>
                <th>Datetime</th>
                <th style={{ maxWidth: 280 }}>Failed cards</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.props.data.length > 0 && this.props.data.map((test, index) => {
                return (
                  <tr key={index}>
                    <td>{test.deck.name}</td>
                    <td>{(test.score * 100).toFixed(2) + '%'}</td>
                    <td>{new Date(test.datetime).toLocaleString()}</td>
                    <td style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: 280,
                      wordBreak: 'break-all',
                      wordWrap: 'break-word'
                    }}>
                      {test.failedCards.join(', ')}
                    </td>
                    <td className="text-right">
                      <Link to={'/testing/' + test.deck.id} style={{ color: '#007bff' }}>
                        <i class="fas fa-arrow-right"></i>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default History;