import React, { Component } from 'react';
import Transition from 'react-transition-group/Transition'
import { connect } from 'react-redux';

import BackDrop from '../../Shared/BackDrop/BackDrop';
import Input from '../../Shared/Input/Input';
import * as actions from '../../../store/actions';
import * as util from '../../../util/util';
import './CardFrontForm.css';

const animationDuration = {
  enter: 200,
  exit: 200
};

const initialForm = {
  front: {
    value: '',
    valid: true,
    validation: {
      required: true
    },
    touched: false,
    error: null
  },
  valid: true
};

class CardFrontForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: initialForm
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.card && prevState.form.front.value === '') {
      return {
        ...prevState,
        form: {
          ...prevState.form,
          front: {
            ...prevState.form.front,
            value: nextProps.card.front
          }
        }
      }
    }
    if (nextProps.error) {
      nextProps.onClearUpdateCardError();
      return {
        ...prevState,
        form: {
          ...prevState.form,
          front: {
            ...prevState.form.front,
            valid: false,
            error: nextProps.error.Front[0]
          },
          valid: false
        }
      };
    }
    return null;
  }

  handleInputChange = (event) => {
    const form = this.state.form;
    const updatedForm = { ...form };
    const updatedField = { ...form[event.target.name] };

    updatedField.value = event.target.value;
    updatedField.touched = true;
    const result = util.checkValidity(updatedField.value, updatedField.validation);
    updatedField.valid = result.valid;
    updatedField.error = result.message

    updatedForm[event.target.name] = updatedField;

    let formIsValid = true;
    for (let item in updatedForm) {
      if (item !== 'valid') {
        formIsValid = formIsValid && updatedForm[item].valid;
      }
    }
    updatedForm.valid = formIsValid;

    this.setState({ form: updatedForm });
  }

  handleSumit = (event) => {
    const { card, onCreateCard, onUpdateCard } = this.props;
    const { form } = this.state;

    event.preventDefault();
    if (form.valid) {
      if (card) {
        onUpdateCard(card.id, form.front.value);
      } else {
        onCreateCard(form.front.value);
      }
    }
  }

  handleClickCancel = () => {
    this.props.onClose();
    this.setState({ form: initialForm });
  }

  render() {
    const { card, onClose, isOpen } = this.props;
    const { form } = this.state;

    return (
      <div className="card-front-form">
        <BackDrop isOpen={isOpen} onClick={onClose} />
        <Transition
          mountOnEnter
          unmountOnExit
          in={isOpen}
          timeout={animationDuration}>
          {state => {
            const cardFormClasses = [
              'card-front-form-wrapper',
              state === 'entering' ? 'card-front-form-open' : (state === 'exiting' ? 'card-front-form-close' : null)
            ];

            return (
              <div className={cardFormClasses.join(' ')}>
                <div className="card-front-form-header">
                  {card ? 'Edit front' : 'Create front'}
                </div>
                <form onSubmit={this.handleSumit}>
                  <div className="card-front-form-input">
                    <label>Front</label>
                    <Input
                      name="front"
                      defaultValue={card?.front}
                      autoComplete="off"
                      autoFocus
                      touched={form.front.touched}
                      valid={form.front.valid}
                      onChange={this.handleInputChange} />
                    {!form.front.valid && (
                      <div className="error-notification">
                        {form.front.error}
                      </div>
                    )}
                  </div>
                  <div className="card-front-form-features">
                    <button
                      className="cancel-btn"
                      type="button"
                      onClick={this.handleClickCancel}>
                      Cancel
                    </button>
                    <button
                      className="update-btn"
                      type="submit">
                      {card ? 'Edit' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            );
          }}
        </Transition>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    error: state.card.errors.updateCardError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onCreateCard: (front) => dispatch(actions.createCard(front)),
    onUpdateCard: (cardId, front) => dispatch(actions.updateCard(cardId, front)),
    onClearUpdateCardError: () => dispatch(actions.clearUpdateCardError())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardFrontForm);