import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Button from '../../../components/Shared/Button/Button';
import CardFrontForm from '../../../components/User/CardFrontForm/CardFrontForm';
import withErrorHandler from '../../../hoc/withErrorHandler';
import * as actions from '../../../store/actions';
import './CreateCard.css';

class CreateCard extends Component {
  UNSAFE_componentWillMount() {
    this.backUrl = this.props.location.state?.backUrl || '/';
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.onToggleCardFrontForm(true);
    }, 0);
  }

  componentWillUnmount() {
    this.props.onResetStateInCardReducer();
  }

  handleClickAddFront = () => {
    this.props.onToggleCardFrontForm(true);
  }

  handleCloseCardFrontForm = () => {
    this.props.onToggleCardFrontForm(false);
  }

  render() {
    const { cardFrontFormOpened } = this.props;
    return (
      <div className="create-card">
        <div className="back-feature">
          <Link to={this.backUrl || '/cards'}>
            Cancel
          </Link>
        </div>
        <div className="card-front">
          <Button className="add-front-btn" onClick={this.handleClickAddFront}>Create front</Button>
        </div>
        <div className="card-back">
          Create front first, then create back!
        </div>
        <CardFrontForm isOpen={cardFrontFormOpened} onClose={this.handleCloseCardFrontForm} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cardFrontFormOpened: state.card.cardFrontFormOpened
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onToggleCardFrontForm: (opened) => dispatch(actions.toggleCardFrontForm(opened)),
    onResetStateInCardReducer: () => dispatch(actions.resetStateInCardReducer())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(CreateCard));