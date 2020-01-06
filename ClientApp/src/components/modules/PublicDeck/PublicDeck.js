/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CardIcon from '../../../images/icons/card.svg';
import DateIcon from '../../../images/icons/calendar.svg';
import './PublicDeck.css';
import authService from '../../api-authorization/AuthorizeService';
import Swal from 'sweetalert2';

class PublicDeck extends Component {
  constructor(props) {
    super(props);
  }

  onClickDownload = (e, deckId) => {
    e.preventDefault();
    Swal.fire({
			title: 'Are you sure to download this deck?',
			showCancelButton: true,
			cancelButtonColor: '#b3b3b3',
			confirmButtonColor: '#007bff',
			confirmButtonText: 'Yes'
		}).then(result => {
			if (result.value) {
				this.download(deckId);
			}
		});
  }

  download = async deckId => {
    const url = `/api/publicdecks/${deckId}/download`;
    const token = await authService.getAccessToken();
    const response = await fetch(url, {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 200) {
      this.props.getPublicDeckData();
    }
  }

  onClickDownloaded = e => {
    e.preventDefault();
  }

  render() {
    // if (this.state.redirect === true) {
    // 	return <Redirect to={deckURL} Component={DeckDetail} />;
    // }
    return (
      <Link to={'/publicdecks/' + this.props.deck.id} className="text-decoration-none flex-item">
        <div className="menu-deck">
          <div className="menu-deck-info">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="w-auto">{this.props.deck.name}</h6>
              {this.props.deck.had === true ?
                <button
                  className="downloaded"
                  onClick={(event) => this.onClickDownloaded(event)}
                >
                  Downloaded
                </button> :
                <button
                  className="download"
                  onClick={(event) => this.onClickDownload(event, this.props.deck.id)}
                >
                  Download
                </button>}
            </div>
            <hr />
            <div className="menu-deck-info-line">
              <img className="icons"
                src={CardIcon} width="21px" height="16px" />
              <p>{this.props.deck.totalCards}</p>
            </div>
            <div className="menu-deck-info-line">
              <img className="icons" src={DateIcon} width="21px" height="16px" />
              <p>{new Date(this.props.deck.createdDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </Link>
    );
  }
}

export default PublicDeck;
