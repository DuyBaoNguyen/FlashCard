import React, { Component } from 'react';

import Cards from './Cards/Cards';
import Decks from './Decks/Decks';
import UsersDecks from './UsersDeck/UsersDeck';

import './Market.css';

class Market extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePage: 1,
		};
	}

	onChangePage = (param) => {
		this.setState({
			activePage: param,
		});
	};

	userTabs = () => {
		if (this.state.activePage === 1) {
			return <Cards />;
		}
		if (this.state.activePage === 2) {
			return <Decks />;
		}
		if (this.state.activePage === 3) {
			return <UsersDecks />;
		}
	};

	handlePageChange(pageNumber) {
		this.setState({ activePage: pageNumber });
	}

	render() {
		let activePage = this.userTabs();
		return (
			<div className="market-wrapper">
				<ul className="market-menu">
					<li
						className={this.state.activePage === 1 ? 'market-page-active' : ''}
						onClick={() => this.onChangePage(1)}
					>
						Cards
					</li>
					<li
						className={this.state.activePage === 2 ? 'market-page-active' : ''}
						onClick={() => this.onChangePage(2)}
					>
						Decks from Admin
					</li>
					<li
						className={this.state.activePage === 3 ? 'market-page-active' : ''}
						onClick={() => this.onChangePage(3)}
					>
						Decks from Users
					</li>
				</ul>
				<div className="market-panel">{activePage}</div>
			</div>
		);
	}
}

export default Market;
