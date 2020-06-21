import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Button from '../../../components/Shared/Button/Button';
import CardFrontForm from '../../../components/User/CardFrontForm/CardFrontForm';
import withErrorHandler from '../../../hoc/withErrorHandler';
import * as actions from '../../../store/actions';
import './EditCard.css';

class EditCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardFrontFormOpened: false
    };
  }

  UNSAFE_componentWillMount() {
    this.backUrl = this.props.location.state?.backUrl || '/';
  }

  componentDidMount() {
    this.cardId = this.props.match.params.cardId;
    this.props.onGetCard(this.cardId);
  }

  handleClickEditFront = () => {
    this.setState({ cardFrontFormOpened: true });
  }

  handleCloseCardFrontForm = () => {
    this.setState({ cardFrontFormOpened: false });
  }

  render() {
    const { card } = this.props;
    const { cardFrontFormOpened } = this.state;

    return (
      <div className="edit-card">
        <div className="back-feature">
          <Link to={this.backUrl || '/cards'}>
            Cancel
          </Link>
        </div>
        <div className="card-front">
          <p>{card?.front}</p>
          <Button className="edit-front-btn" onClick={this.handleClickEditFront}>Edit front</Button>
        </div>
        <div className="card-back">

        </div>
        <CardFrontForm isOpen={cardFrontFormOpened} onClose={this.handleCloseCardFrontForm} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    card: state.card.card
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetCard: (cardId) => dispatch(actions.getCard(cardId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(EditCard));