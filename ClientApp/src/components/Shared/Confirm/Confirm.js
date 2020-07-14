import React, { PureComponent } from 'react';
import Transition from 'react-transition-group/Transition'

import BackDrop from '../../Shared/BackDrop/BackDrop';
import OptionButton from '../OptionButton/OptionButton';
import './Confirm.css';

const animationDuration = {
  enter: 0,
  exit: 0
};

class Confirm extends PureComponent {
  render() {
    const {
      isOpen,
      header,
      message,
      cancelLabel,
      confirmLabel,
      confirmColor,
      onCancel,
      onConfirm
    } = this.props;

    return (
      <div className="confirm-wrapper">
        <BackDrop isOpen={isOpen} onClick={onCancel} />
        <Transition
          mountOnEnter
          unmountOnExit
          in={isOpen}
          timeout={animationDuration}>
          {state => {
            return (
              <div className="confirm">
                <div className="confirm-header">{header}</div>
                <p className="confirm-message">{message}</p>
                <div className="confirm-features">
                  <OptionButton
                    className="cancel-btn"
                    onClick={onCancel}>
                    {cancelLabel || 'Cancel'}
                  </OptionButton>
                  <OptionButton
                    className="confirm-btn"
                    style={{ backgroundColor: confirmColor }}
                    onClick={onConfirm}>
                    {confirmLabel || 'OK'}
                  </OptionButton>
                </div>
              </div>
            );
          }}
        </Transition>
      </div>
    );
  }
}

export default Confirm;