import React, { Component } from 'react';
import Transition from 'react-transition-group/Transition'
import { connect } from 'react-redux';

import BackDrop from '../../Shared/BackDrop/BackDrop';
import Input from '../../Shared/Input/Input';
import * as actions from '../../../store/actions';
import * as util from '../../../util/util';
import './PasswordUpdatingForm.css';

const animationDuration = {
  enter: 200,
  exit: 200
};

const initialForm = {
  oldPassword: {
    value: '',
    valid: true,
    validation: {
      required: true,
      minLength: 8,
      maxLength: 20
    },
    touched: false,
    error: null
  },
  newPassword: {
    value: '',
    valid: true,
    validation: {
      required: true,
      minLength: 8,
      maxLength: 20
    },
    touched: false,
    error: null
  },
  confirmPassword: {
    value: '',
    valid: true,
    validation: {
      required: true,
      minLength: 8,
      maxLength: 20
    },
    touched: false,
    error: null
  },
  valid: true
};

class PasswordUpdatingForm extends Component {
  state = {
    form: initialForm
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.error) {
      nextProps.onClearUpdatePasswordError();
      return {
        ...prevState,
        form: {
          ...prevState.form,
          oldPassword: {
            ...prevState.form.oldPassword,
            valid: nextProps.error.OldPassword ? false : true,
            error: nextProps.error.OldPassword ? nextProps.error.OldPassword[0] : null,
            touched: true
          },
          newPassword: {
            ...prevState.form.newPassword,
            valid: nextProps.error.NewPassword ? false : true,
            error: nextProps.error.NewPassword ? nextProps.error.NewPassword[0] : null,
            touched: true
          },
          confirmPassword: {
            ...prevState.form.confirmPassword,
            valid: nextProps.error.ConfirmPassword ? false : true,
            error: nextProps.error.ConfirmPassword ? nextProps.error.ConfirmPassword[0] : null,
            touched: true
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
    updatedField.error = result.message;

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
    const { form } = this.state;

    event.preventDefault();
    if (form.valid) {
      this.props.onUpdatePassword(form.oldPassword.value, form.newPassword.value, form.confirmPassword.value);
    }
  }

  handleClickCancel = () => {
    this.props.onClose();
    this.setState({ form: initialForm });
  }

  render() {
    const { isOpen } = this.props;
    const { form } = this.state;

    return (
      <div className="password-updating-form">
        <BackDrop isOpen={isOpen} onClick={this.handleClickCancel} />
        <Transition
          mountOnEnter
          unmountOnExit
          in={isOpen}
          timeout={animationDuration}>
          {state => {
            const passwordUpdatingFormClasses = [
              'password-updating-form-wrapper',
              state === 'entering' ? 'password-updating-form-open' : (state === 'exiting' ? 'password-updating-form-close' : null)
            ];

            return (
              <div className={passwordUpdatingFormClasses.join(' ')}>
                <div className="password-updating-form-header">Edit password</div>
                <form onSubmit={this.handleSumit}>
                  <div className="password-updating-form-input">
                    <label>Current password</label>
                    <Input
                      type="password"
                      name="oldPassword"
                      autoComplete="off"
                      autoFocus
                      touched={form.oldPassword.touched}
                      valid={form.oldPassword.valid}
                      onChange={this.handleInputChange} />
                    {!form.oldPassword.valid && (
                      <div className="error-notification">
                        {form.oldPassword.error}
                      </div>
                    )}
                    <label>New password</label>
                    <Input
                      type="password"
                      name="newPassword"
                      autoComplete="off"
                      touched={form.newPassword.touched}
                      valid={form.newPassword.valid}
                      onChange={this.handleInputChange} />
                    {!form.newPassword.valid && (
                      <div className="error-notification">
                        {form.newPassword.error}
                      </div>
                    )}
                    <label>Confirmation password</label>
                    <Input
                      type="password"
                      name="confirmPassword"
                      autoComplete="off"
                      touched={form.confirmPassword.touched}
                      valid={form.confirmPassword.valid}
                      onChange={this.handleInputChange} />
                    {!form.confirmPassword.valid && (
                      <div className="error-notification">
                        {form.confirmPassword.error}
                      </div>
                    )}
                  </div>
                  <div className="password-updating-form-features">
                    <button
                      className="cancel-btn"
                      type="button"
                      onClick={this.handleClickCancel}>
                      Cancel
                    </button>
                    <button className="update-btn" type="submit">Update</button>
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
    error: state.home.errors.updatePasswordError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdatePassword: (oldPassword, newPassword, confirmPassword) =>
      dispatch(actions.updatePassword(oldPassword, newPassword, confirmPassword)),
    onClearUpdatePasswordError: () => dispatch(actions.clearUpdatePasswordError())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PasswordUpdatingForm);