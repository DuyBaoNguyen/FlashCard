import React, { Component } from 'react';
import { connect } from 'react-redux';

import Chart from './Chart/Chart';
import * as actions from '../../../store/actions';

import './Statistics.css';

class Statistics extends Component {
  componentDidMount() {
    this.props.onGetStatistics();
  }

  render() {
    return (
      <div className="statistics-wrapper">
        <div className="statistics-header">
          <p>Statistics</p>
        </div>
        <Chart data={this.props.statistics} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    statistics: state.home.statistics
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetStatistics: () => dispatch(actions.getStatistics())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);