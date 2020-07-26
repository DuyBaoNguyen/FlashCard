import React, { Component } from 'react';
import Transition from 'react-transition-group/Transition'
import { connect } from 'react-redux';
import { Icon } from '@iconify/react';
import imageIcon from '@iconify/icons-bi/image';
import removeImageIcon from '@iconify/icons-uil/image-alt-slash';

import BackDrop from '../../Shared/BackDrop/BackDrop';
import Input from '../../Shared/Input/Input';
import Select from '../../Shared/Select/Select';
import * as actions from '../../../store/actions';
import * as util from '../../../util/util';
import './CardProposingForm.css';

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
  meaning: {
    value: '',
    valid: true,
    validation: {
      required: true
    },
    touched: false,
    error: null
  },
  type: {
    value: '',
    valid: true,
    validation: {},
    touched: false,
    error: null
  },
  example: {
    value: '',
    valid: true,
    validation: {},
    touched: false,
    error: null
  },
  image: {
    value: null,
    valid: true,
    validation: {},
    touched: false,
    error: null
  },
  valid: true
};

class CardProposingForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: initialForm
    };
    this.backImage = React.createRef();
    this.backImageInput = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.error) {
      nextProps.onClearProposeCardError();
      return {
        ...prevState,
        form: {
          ...prevState.form,
          front: {
            ...prevState.form.meaning,
            valid: nextProps.error.Front ? false : true,
            error: nextProps.error.Front ? nextProps.error.Front[0] : null,
            touched: true
          },
          meaning: {
            ...prevState.form.meaning,
            valid: nextProps.error.Meaning ? false : true,
            error: nextProps.error.Meaning ? nextProps.error.Meaning[0] : null,
            touched: true
          },
          type: {
            ...prevState.form.type,
            valid: nextProps.error.Type ? false : true,
            error: nextProps.error.Type ? nextProps.error.Type[0] : null,
            touched: true
          },
          example: {
            ...prevState.form.example,
            valid: nextProps.error.Example ? false : true,
            error: nextProps.error.Example ? nextProps.error.Example[0] : null,
            touched: true
          },
          image: {
            ...prevState.form.image,
            valid: nextProps.error.Image ? false : true,
            error: nextProps.error.Image ? nextProps.error.Image[0] : null,
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
    const { onProposeCard } = this.props;
    const { form } = this.state;

    event.preventDefault();
    if (form.valid) {
      const card = {
        front: form.front.value,
        meaning: form.meaning.value,
        type: form.type.value,
        example: form.example.value,
        image: form.image.value
      };
      onProposeCard(card);
    }
  }

  handleClickCancel = () => {
    this.props.onClose();
  }

  handleTransitionExited = () => {
    this.setState({ form: initialForm });
  }

  handleImageChange = (event) => {
    if (event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.backImage.current.src = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);

      const updatedForm = { ...this.state.form };
      const imageState = {
        ...this.state.form.image,
        value: event.target.files[0],
        error: null,
        valid: true
      };
      updatedForm.image = imageState;
      updatedForm.valid = true;

      for (let key in updatedForm) {
        if (key !== 'valid') {
          updatedForm.valid = updatedForm.valid && updatedForm[key].valid;
        }
      }

      this.backImageInput.current.value = null;

      this.setState({ form: updatedForm });
    }
  }

  handleClickImageContainer = () => {
    this.backImageInput.current.click();
  }

  handleRemoveImage = (event) => {
    event.stopPropagation();

    this.backImage.current.src = null;
    const updatedForm = { ...this.state.form };
    const imageState = {
      ...this.state.form.image,
      value: null
    };
    updatedForm.image = imageState;

    this.setState({ form: updatedForm });

    this.backImageInput.current.value = null;
  }

  render() {
    const { isOpen } = this.props;
    const { form } = this.state;

    return (
      <div className="card-proposing-form">
        <BackDrop isOpen={isOpen} onClick={this.handleClickCancel} />
        <Transition
          mountOnEnter
          unmountOnExit
          in={isOpen}
          timeout={animationDuration}
          onExited={this.handleTransitionExited}>
          {state => {
            const cardProposingFormClasses = [
              'card-proposing-form-wrapper',
              state === 'entering' ? 'card-proposing-form-open' : (state === 'exiting' ? 'card-proposing-form-close' : null)
            ];

            return (
              <div className={cardProposingFormClasses.join(' ')}>
                <div className="card-proposing-form-header">Propose card</div>
                <form onSubmit={this.handleSumit}>
                  <div className="card-proposing-form-input">
                    <label>Front</label>
                    <Input
                      name="front"
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
                    <label>Meaning</label>
                    <Input
                      name="meaning"
                      autoComplete="off"
                      touched={form.meaning.touched}
                      valid={form.meaning.valid}
                      onChange={this.handleInputChange} />
                    {!form.meaning.valid && (
                      <div className="error-notification">
                        {form.meaning.error}
                      </div>
                    )}
                    <label>Type</label>
                    <Select
                      name="type"
                      touched={form.type.touched}
                      valid={form.type.valid}
                      onChange={this.handleInputChange}>
                      <option value="">none</option>
                      <option value="noun">noun</option>
                      <option value="verb">verb</option>
                      <option value="abjective">abjective</option>
                      <option value="abverb">abverb</option>
                      <option value="preposition">preposition</option>
                    </Select>
                    {!form.type.valid && (
                      <div className="error-notification">
                        {form.type.error}
                      </div>
                    )}
                    <label>Example</label>
                    <Input
                      name="example"
                      autoComplete="off"
                      touched={form.example.touched}
                      valid={form.example.valid}
                      onChange={this.handleInputChange} />
                    {!form.example.valid && (
                      <div className="error-notification">
                        {form.example.error}
                      </div>
                    )}
                    <label>Image</label>
                    <div className="image-container" onClick={this.handleClickImageContainer}>
                      {form.image.value
                        ? (
                          <>
                            <img
                              alt=""
                              width="100"
                              height="100"
                              ref={this.backImage}
                              className="back-image" />
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={this.handleRemoveImage}>
                              <Icon icon={removeImageIcon} color="#fff" style={{ fontSize: 20 }} />
                            </button>
                          </>
                        )
                        : (
                          <Icon icon={imageIcon} color="#ddd" style={{ fontSize: 32 }} />
                        )
                      }
                    </div>
                    {!form.image.valid && (
                      <div className="error-notification">
                        {form.image.error}
                      </div>
                    )}
                    <input
                      type="file"
                      id="back-image-input"
                      ref={this.backImageInput}
                      onChange={this.handleImageChange} />
                  </div>
                  <div className="card-proposing-form-features">
                    <button
                      className="cancel-btn"
                      type="button"
                      onClick={this.handleClickCancel}>
                      Cancel
                    </button>
                    <button
                      className="update-btn"
                      type="submit">
                      Propose
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
    error: state.cardProposal.proposeCardError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onProposeCard: (card) => dispatch(actions.proposeCard(card)),
    onClearProposeCardError: () => dispatch(actions.clearProposeCardError())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardProposingForm);