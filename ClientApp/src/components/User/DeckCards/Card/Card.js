import React, { Component } from 'react';
import ReactCardFlip from 'react-card-flip';
import { Icon } from '@iconify/react';
import volumeIcon from '@iconify/icons-uil/volume';
import optionIcon from '@iconify/icons-uil/ellipsis-h';
import editIcon from '@iconify/icons-uil/edit';
import deleteIcon from '@iconify/icons-uil/trash-alt';

import { speak } from '../../../../textToSpeech';
import DropDown from '../../../Shared/DropDown/DropDown';
import DropDownItem from '../../../Shared/DropDownItem/DropDownItem';
import {
  NOT_SPEAKING_SPEAKER_COLOR,
  SPEAKING_SPEAKER_COLOR
} from '../../../../applicationConstants';
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
    this.setState(state => {
      return { isFlipped: !state.isFlipped };
    });
  }

  handleSpeak = (event) => {
    event.stopPropagation();
    if (!this.state.isSpeaking) {
      speak(this.props.card.front, this.onStartSpeech, this.onEndSpeech);
    }
  }

  onStartSpeech = () => {
    this.setState({
      speakerColor: SPEAKING_SPEAKER_COLOR,
      isSpeaking: true
    });
  }

  onEndSpeech = () => {
    this.setState({
      speakerColor: NOT_SPEAKING_SPEAKER_COLOR,
      isSpeaking: false
    });
  }

  render() {
    const { card } = this.props;
    const { isFlipped, speakerColor } = this.state;
    return (
      <div className="card-wrapper" onClick={() => this.props.onClick(card.id)}>
        <ReactCardFlip
          isFlipped={isFlipped}
          flipDirection="horizontal">
          <div className="card-front" onClick={this.handleClickCard}>
            <div className="card-options">
              <DropDown
                right
                postfix={<Icon icon={optionIcon} color="#979797" style={{ fontSize: 20 }} />}
                className="dropdown-toggler">
                <DropDownItem
                  type="link"
                  path={`/cards/${card.id}/edit`}
                  icon={<Icon icon={editIcon} color="#535353" />}
                  label="Edit card" />
                <DropDownItem
                  type="button"
                  icon={<Icon icon={deleteIcon} color="red" />}
                  label="Remove card"
                  className="remove-card-btn"
                  onClick={() => this.props.onRemove(card.id)} />
              </DropDown>
            </div>
            <div className="front">
              {card.front}
              <div className="utterance" onClick={this.handleSpeak}>
                <Icon icon={volumeIcon} color={speakerColor} style={{ fontSize: 20 }} />
              </div>
            </div>
          </div>
          <div className="card-back" onClick={this.handleClickCard}>
            {card.backs.map(back => back.meaning).join(' - ')}
            <div className="card-options">
              <DropDown
                right
                postfix={<Icon icon={optionIcon} color="#979797" style={{ fontSize: 20 }} />}
                className="dropdown-toggler">
                <DropDownItem
                  type="link"
                  path={`/cards/${card.id}/edit`}
                  icon={<Icon icon={editIcon} color="#535353" />}
                  label="Edit card" />
                <DropDownItem
                  type="button"
                  icon={<Icon icon={deleteIcon} color="red" />}
                  label="Remove card"
                  className="remove-card-btn"
                  onClick={() => this.props.onRemove(card.id)} />
              </DropDown>
            </div>
          </div>
        </ReactCardFlip>
      </div>
    );
  }
}

export default Card;