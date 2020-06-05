import React from 'react';

import Chart from './Chart/Chart';
import './Statistics.css';

const statistics = props => (
  <div className="statistics-wrapper">
    <div className="statistics-header">
      <p>Statistics</p>
    </div>
    <Chart data={props.data} />
  </div>
);

export default statistics;