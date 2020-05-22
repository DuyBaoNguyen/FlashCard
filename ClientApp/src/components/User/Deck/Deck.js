import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button, Input, Pagination } from 'antd';
import { Icon, InlineIcon } from '@iconify/react';
import layerGroup from '@iconify/icons-uil/layer-group';
import calendarAlt from '@iconify/icons-uil/calendar-alt';

import './Deck.css';

const { Search } = Input;

class Deck extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hasError: false,
		};
	}

	render() {
		let date = new Date(this.props.createdDate);
		const backgroundColor = {
			background: this.props.backgroundColor,
		};

		if (this.state.hasError) {
			return <h1>Something went wrong.</h1>;
		}
		return (
			<div className="deck">
				<div className="wrapper">
					<div className="deck-background-color" style={backgroundColor}>
						<div className="deck-name">{this.props.name}</div>
						<div className="deck-description">
							{this.props.description}
						</div>
						<div className="deck-info">
							<div className="deck-info-value">
								<Icon
									icon={layerGroup}
									style={{ color: '#ffffff', fontSize: '24px' }}
								/>
								<p>{this.props.cards}</p>
							</div>
							<div className="deck-info-value">
							<Icon icon={calendarAlt} style={{color: '#ffffff', fontSize: '24px'}} />
							<p>{date !== undefined ? date.toLocaleDateString() : null}</p>
							</div>
						</div>
					</div>
					<div className="deck-background-white-1"></div>
					<div className="deck-background-white-2"></div>
				</div>
			</div>
		);
	}
}

export default Deck;
