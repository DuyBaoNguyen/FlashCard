import React, { Component } from 'react';
import { Animated } from 'react-animated-css';
import { Link } from 'react-router-dom';
import './Result.css';

class Result extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isFlipped: false,
			isNext: false,
			isDelete: false,
		};
	}

	render() {
		return (
			<div className="result-wrapper">
				<br/>
				<Animated animationIn="bounceIn" animationInDelay={0} isVisible={true}>
					<div className="result-header">
						Congratulation! 
						<span role="img" aria-label="clap">👏🏻</span>
						<span role="img" aria-label="clap">👏🏻</span>
						<span role="img" aria-label="clap">👏🏻</span>
						<br />
						<Animated
							animationIn="bounceIn"
							animationInDelay={300}
							isVisible={true}
						>
							You have finished the lesson! 
						</Animated>
					</div>
				</Animated>
				<Animated
					animationIn="bounceIn"
					animationInDelay="600"
					isVisible={true}
				>
					<div className="result-table">
						<div className="result-info">
							<div className="result-title">Number of succeeded cards</div>
							<div className="result-value">{this.props.succeeded}</div>
						</div>
						<br />
						<div className="result-info">
							<div className="result-title">Number of failed cards</div>
							<div className="result-value">{this.props.failed}</div>
						</div>
						<br />
						<div className="result-button">
							<Link to="/">
								<button>OK</button>
							</Link>
						</div>
					</div>
				</Animated>
			</div>
		);
	}
}

export default Result;
