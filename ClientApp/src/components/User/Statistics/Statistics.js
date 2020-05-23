import React, { PureComponent } from 'react';

import Chart from './Chart/Chart';
import './Statistics.css';

class Statistics extends PureComponent {
  render() {
    return (
      <div className="statistics-wrapper">
        <div className="statistics-header">
          <p>Statistics</p>
        </div>
        <p style={{ fontSize: 12 }}>(%) Failed cards on total tested cards</p>
        <Chart data={undefined} />
      </div>
    );
  }
}

export default Statistics;