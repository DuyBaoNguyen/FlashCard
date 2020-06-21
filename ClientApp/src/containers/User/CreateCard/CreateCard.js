import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Button from '../../../components/Shared/Button/Button';
import CardFrontForm from '../../../components/User/CardFrontForm/CardFrontForm';
import withErrorHandler from '../../../hoc/withErrorHandler';
import './CreateCard.css';

class CreateCard extends Component {
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
    this.timeoutNumber = setTimeout(() => {
      this.setState({ cardFrontFormOpened: true });
    }, 0);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutNumber);
  }

  handleClickAddFront = () => {
    this.setState({ cardFrontFormOpened: true });
  }

  handleCloseCardFrontForm = () => {
    this.setState({ cardFrontFormOpened: false });
  }

  render() {
    const { cardFrontFormOpened } = this.state;
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

export default withErrorHandler(CreateCard);