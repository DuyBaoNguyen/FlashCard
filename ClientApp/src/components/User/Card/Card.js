import React, { Component } from 'react';
import ReactCardFlip from 'react-card-flip';
import { Icon } from '@iconify/react';
import volumeIcon from '@iconify/icons-uil/volume';
import optionIcon from '@iconify/icons-uil/ellipsis-h';

import { speak } from '../../../textToSpeech';
import DropDown from '../../Shared/DropDown/DropDown';
import DropDownItem from '../../Shared/DropDownItem/DropDownItem';
import {
  NOT_SPEAKING_SPEAKER_COLOR,
  SPEAKING_SPEAKER_COLOR
} from '../../../applicationConstants';
import './Card.css';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFlipped: false,
      speakerColor: NOT_SPEAKING_SPEAKER_COLOR,
      isSpeaking: false
    };
  }

  handleClickCard = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.card.id);
    }
    this.setState(state => {
      return { isFlipped: !state.isFlipped };
    });
  }

  handleSpeak = (event) => {
    event.stopPropagation();
    if (!this.state.isSpeaking) {
      speak(this.props.card.front, this.handleStartSpeech, this.handleEndSpeech);
    }
  }

  handleSelectCard = (event) => {
    event.stopPropagation();
    this.props.onSelect(this.props.card.id);
  }

  handleStartSpeech = () => {
    this.setState({
      speakerColor: SPEAKING_SPEAKER_COLOR,
      isSpeaking: true
    });
  }

  handleEndSpeech = () => {
    this.setState({
      speakerColor: NOT_SPEAKING_SPEAKER_COLOR,
      isSpeaking: false
    });
  }

  renderOptions = (options) => {
    if (!options) {
      return null;
    }
    return (
      <DropDown
        right
        mouseLeaveToClose
        postfix={<Icon icon={optionIcon} color="#979797" style={{ fontSize: 20 }} />}
        className="dropdown-toggler">
        {options.map((option, index) => {
          if (option.type === 'link') {
            return (
              <DropDownItem
                key={index}
                type="link"
                path={option.path}
                icon={option.icon}
                label={option.label.value}
                labelColor={option.label.color}
                className="dropdown-item-custom" />
            );
          }
          return (
            <DropDownItem
              key={index}
              type="button"
              icon={option.icon}
              label={option.label.value}
              labelColor={option.label.color}
              onClick={option.onClick}
              className="dropdown-item-custom" />
          );
        })}
      </DropDown>
    );
  }

  render() {
    const { card, options, selectionIcon } = this.props;
    const { isFlipped, speakerColor } = this.state;
    return (
      <div className="card-wrapper">
        <ReactCardFlip
          isFlipped={isFlipped}
          flipDirection="horizontal">
          <div className="card-front" onClick={this.handleClickCard}>
            {selectionIcon && (
              <div className="selectable-icon" onClick={this.handleSelectCard}>
                {selectionIcon}
              </div>
            )}
            <div className="card-options">
              {this.renderOptions(options)}
            </div>
            <div className="front">
              {card.front}
              <div className="utterance" onClick={this.handleSpeak}>
                <Icon icon={volumeIcon} color={speakerColor} style={{ fontSize: 20 }} />
              </div>
            </div>
          </div>
          <div className="card-back" onClick={this.handleClickCard}>
            {selectionIcon && (
              <div className="selectable-icon" onClick={this.handleSelectCard}>
                {selectionIcon}
              </div>
            )}
            <div className="card-options">
              {this.renderOptions(options)}
            </div>
            {card.backs.map(back => back.meaning).join(' - ')}
          </div>
        </ReactCardFlip>
      </div>
    );
  }
}

export default Card;