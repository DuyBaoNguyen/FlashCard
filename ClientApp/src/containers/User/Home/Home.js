import React, { Component } from 'react';
import { connect } from 'react-redux';

import withErrorHandler from '../../../hoc/withErrorHandler';
import * as actions from '../../../store/actions/index';
import Statistics from '../../../components/User/Statistics/Statistics';
import DeckWrapper from '../../../components/User/DeckWrapper/DeckWrapper';
import './Home.css';

class Home extends Component {
  componentDidMount() {
    this.props.onGetStatistics();
  }

  render() {
    return (
      <div className="home">
        <Statistics data={this.props.statistics} />
        <DeckWrapper className="deck-wrapper" />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    statistics: state.home.statistics
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetStatistics: () => dispatch(actions.getStatistics())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Home));