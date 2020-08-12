import React, { Component } from 'react';
import ReactCardFlip from 'react-card-flip';
import { Icon } from '@iconify/react';
import volumeIcon from '@iconify/icons-uil/volume';

import { speak } from '../../../../textToSpeech';
import { NOT_SPEAKING_SPEAKER_COLOR, SPEAKING_SPEAKER_COLOR } from '../../../../applicationConstants';
import './LearnVocab.css';

class LearnVocab extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isFlipped: false,
			isNext: false,
			isDelete: false,
			speakerColor: NOT_SPEAKING_SPEAKER_COLOR,
      isSpeaking: false
		};
	}

	onDontRemember = () => {
		this.setState({
			isFlipped: !this.state.isFlipped,
			isNext: true,
			isDelete: false,
		});
	};

	onRemember = () => {
		this.setState({
			isFlipped: !this.state.isFlipped,
			isNext: true,
			isDelete: true,
		});
	};

	onNext = () => {
		this.setState({
			isFlipped: !this.state.isFlipped,
		});
		this.props.onNext(this.state.isDelete, this.props.currentVocab?.id);
	};

	handleSpeak = (word) => {
    if (!this.state.isSpeaking) {
      speak(word, this.handleStartSpeech, this.handleEndSpeech);
    }
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

	render() {
		let buttons = (
			<>
				<div className="testing-button-dont-remember">
					<button onClick={() => this.onDontRemember()}>Don't Remember</button>
				</div>
				<div className="testing-button-remember">
					<button onClick={() => this.onRemember()}>Remember</button>
				</div>
			</>
		);

		let nextButton = (
			<>
				<div className="testing-button-next">
					<button onClick={() => this.onNext()}>Next</button>
				</div>
			</>
		);

		let instructionFront = (
			<div>
				{' '}
				Oops! Not yet! 😅 <br />
				Just a few note to make sure you totally understand this lesson. 😉
				<br />
				<br />
				This is the front side of the card.
				<br />
				Every card in this deck will appear sequentially.
				<br />
				Press <b style={{ color: '#52c41a' }}>Remember</b> if you are sure
				you've learned the card.
				<br />
				Press
				<b style={{ color: '#fe656d' }}> Don't remember</b> is you forget what
				that card means.
				<br />
				<br />
				There is also a <b style={{ color: '#138ce4' }}>progress bar</b> on top
				of the page displaying how many percent of the lesson you have done.
			</div>
		);

		let instructionBack = (
			<div style={{ fontSize: '#20px' }}>
				Nice!!! You have flipped the card!
				<span role="img" aria-label="">😋</span>
				<br />
				<br />
				This is the back side which displays meanings, word types, examples and
				images of the card.
				<br />
				<br />
				Press <b style={{ color: '#91a4ff' }}>Next</b> button below to go to the
				next card. 👌🏻
			</div>
		);

		let front = (
			<div className="testing-card">
				<div className="testing-card-front">
					{this.props.currentVocab !== null
						? (
							<div className="vocabulary">
								{this.props.currentVocab?.front}
								<div className="utterance" onClick={() => this.handleSpeak(this.props.currentVocab?.front)}>
									<Icon icon={volumeIcon} color={this.state.speakerColor} style={{ fontSize: 24 }} />
								</div>
							</div>
						)
						: instructionFront}
				</div>
			</div >
		);

		let back = this.props.currentVocab?.backs.map((back, index) => {
			return (
				<div key={back.id} className="back-card">
					{back.imageUrl && (
						<img
							src={back.imageUrl}
							alt="back_image"
							className="back-image"
							width="120"
							height="120" />
					)}
					<p className="back-meaning">{back.meaning}</p>
					<p className="back-type">{back.type}</p>
					<p className="back-example">{back.example}</p>
				</div>
			);
		});

		let backSide = (
			<div className="testing-card">
				<div className="testing-card-back">
					{this.props.currentVocab !== null ? back : instructionBack}
				</div>
			</div>
		);

		return (
			<div className="learn-wrapper">
				<ReactCardFlip
					flipSpeedBackToFront="0.00001"
					isFlipped={this.state.isFlipped}
					flipDirection="vertical"
				>
					{front}
					{backSide}
				</ReactCardFlip>
				<div className="testing-button">
					{this.state.isFlipped !== true ? buttons : nextButton}
				</div>
			</div>
		);
	}
}

export default LearnVocab;
