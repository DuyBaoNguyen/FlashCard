import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button, Input, Pagination } from 'antd';
import { Icon, InlineIcon } from '@iconify/react';
import plusIcon from '@iconify/icons-uil/plus';

import Deck from '../Deck/Deck';

import './DeckWrapper.css';

const { Search } = Input;

class DeckWrapper extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hasError: false,
		};
	}

	render() {
		if (this.state.hasError) {
			return <h1>Something went wrong.</h1>;
		}
		return (
			<div className="deck-wrapper">
				<div className="deck-header">
					<p>My decks</p>
					<div className="deck-header-features">
						<Button
							className="deck-header-features-add"
							type="primary"
							shape="rounded"
							icon={<Icon icon={plusIcon} />}
							size="medium"
						/>
						<Search
							className="deck-header-features-search"
							placeholder="Search..."
						/>
						{/* <Pagination size="small" total={50} /> */}
					</div>
				</div>
				<br />
				<div className="decks">
					<Deck backgroundColor='#95dded' cards='123' date='12th May, 2020'/>
					<Deck backgroundColor='#9FCBF5' cards='123' date='12th May, 2020'/>
					<Deck backgroundColor='#FFB1B1' cards='123' date='12th May, 2020'/>
					<Deck backgroundColor='#FDD39D' cards='123' date='12th May, 2020'/>
					{/* <Deck backgroundColor='#9FCBF5'/> */}
				</div>
			</div>
		);
	}
}

export default DeckWrapper;
