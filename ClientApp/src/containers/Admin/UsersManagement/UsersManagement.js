import React, { Component } from 'react';
import { connect } from 'react-redux';

import withErroHandler from '../../../hoc/withErrorHandler';
import './UsersManagement.css';

class UsersManagement extends Component {

  componentWillUnmount() {
  }

  render() {
    return (
      <div className="add-cards">
Hi
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // onResetStateInDeckDetailReducer: () => dispatch(actions.resetStateInDeckDetailReducer())
  };
};

export default UsersManagement;