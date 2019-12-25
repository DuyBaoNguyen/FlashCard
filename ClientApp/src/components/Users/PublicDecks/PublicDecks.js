import React, { Component } from 'react';

import PublicDeckList from '../../modules/PublicDeckList/PublicDeckList';

class PublicDecks extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	render() {
		return (
			<div>
				<div className="dashboard-field">
					{/* <div className="dashboard-container">
						{info}
						{history}
					</div> */}
					<PublicDeckList menuName="Public decks" addButton="true" />
				</div>
			</div>
		);
	}
}

export default PublicDecks;
