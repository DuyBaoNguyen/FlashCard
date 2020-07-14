import React, { Component } from 'react';
import Transition from 'react-transition-group/Transition'
import { connect } from 'react-redux';

import BackDrop from '../../Shared/BackDrop/BackDrop';
import Input from '../../Shared/Input/Input';
import * as actions from '../../../store/actions';
import * as util from '../../../util/util';
import './NameUpdatingForm.css';

const animationDuration = {
  enter: 200,
  exit: 200
};

const initialForm = {
  displayName: {
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

class NameUpdatingForm extends Component {
  state = {
    form: initialForm
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.profile && prevState.form.displayName.value === '') {
      return {
        ...prevState,
        form: {
          ...prevState.form,
          displayName: {
            ...prevState.form.displayName,
            value: nextProps.profile.displayName
          }
        }
      }
    }
    if (nextProps.error) {
      nextProps.onClearUpdateCurrentUserNameError();
      return {
        ...prevState,
        form: {
          ...prevState.form,
          displayName: {
            ...prevState.form.displayName,
            valid: false,
            error: nextProps.error.displayName[0]
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
    event.preventDefault();
    if (this.state.form.valid) {
      this.props.onUpdateCurrentUserName(this.state.form.displayName.value);
    }
  }

  handleClickCancel = () => {
    this.props.onClose();
    this.setState({ form: initialForm });
  }

  render() {
    const { profile, onClose, isOpen } = this.props;
    const { form } = this.state;

    return (
      <div className="name-updating-form">
        <BackDrop isOpen={isOpen} onClick={onClose} />
        <Transition
          mountOnEnter
          unmountOnExit
          in={isOpen}
          timeout={animationDuration}>
          {state => {
            const nameUpdatingFormClasses = [
              'name-updating-form-wrapper',
              state === 'entering' ? 'name-updating-form-open' : (state === 'exiting' ? 'name-updating-form-close' : null)
            ];

            return (
              <div className={nameUpdatingFormClasses.join(' ')}>
                <div className="name-updating-form-header">Edit display name</div>
                <form onSubmit={this.handleSumit}>
                  <div className="name-updating-form-input">
                    <label>Name</label>
                    <Input
                      name="displayName"
                      defaultValue={profile?.displayName}
                      autoComplete="off"
                      autoFocus
                      touched={form.displayName.touched}
                      valid={form.displayName.valid}
                      onChange={this.handleInputChange} />
                    {!form.displayName.valid && (
                      <div className="error-notification">
                        {form.displayName.error}
                      </div>
                    )}
                  </div>
                  <div className="name-updating-form-features">
                    <button
                      className="cancel-btn"
                      type="button"
                      onClick={this.handleClickCancel}>
                      Cancel
                    </button>
                    <button className="update-btn" type="submit">
                      Update
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
    error: state.home.errors.updateCurrentUserNameError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateCurrentUserName: (displayName) => dispatch(actions.updateCurrentUserName(displayName)),
    onClearUpdateCurrentUserNameError: () => dispatch(actions.clearUpdateCurrentUserNameError())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NameUpdatingForm);