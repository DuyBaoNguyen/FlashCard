import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import { Link } from 'react-router-dom';
import MaterialTable from 'material-table';

import './PublicDeckDetail.css';

class PublicDeckDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      deckData: {}
    };
  }

  componentWillMount() {
    var deckID = this.getDeckIDFromPath();
    this.setState({
      id: deckID
    });
  }

  componentDidMount() {
    this.getPublicDeckData();
  }

  getDeckIDFromPath = () => {
    return this.props.match.params.deckId;
  };

  getPublicDeckData = async () => {
    var url = '/api/publicdecks/' + this.state.id;
    const token = await authService.getAccessToken();
    const response = await fetch(url, {
      headers: !token ? {} : { Authorization: `Bearer ${token}` }
    });
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      this.setState({
        deckData: data,
        loading: false
      });
    }
  };

  onClickDownload = async (e, deckId) => {
    e.preventDefault();
    const url = `/api/publicdecks/${deckId}/download`;
    const token = await authService.getAccessToken();
    const response = await fetch(url, {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 200) {
      this.getPublicDeckData();
    }
  }

  onClickDownloaded = e => {
    e.preventDefault();
  }

  transData = () => {
    var mockData = [];
    var oldVocab = Object.create(null);
    var data = this.state.deckData.cards;
    if (data != undefined) {
      data.map((vocab, index) => {
        oldVocab = {
          id: vocab.id,
          front: vocab.front,
          backs: vocab.backs
            .map((back, index2) => {
              return back.meaning;
            })
            .join(' - '),
          originBacks: vocab.backs
        };
        mockData.push(oldVocab);
      });
      return mockData;
    }
  };

  table = () => {
    var data = this.transData();
    var title = 'Cards';
    return (
      <MaterialTable
        title={title}
        columns={[
          // { title: 'ID', field: 'id' },
          { title: 'Front', field: 'front' },
          { title: 'Backs', field: 'backs' }
        ]}
        data={data}
        detailPanel={rowData => {
          return (
            <div className="back-container">
              <div className="backs-list">
                {rowData.originBacks.map((back, index) => {
                  return (
                    <div className="back-item">
                      <div className="back-content">
                        <div className="back-info">
                          <br />
                          <p className="back-meaning">{back.meaning}</p>
                          <p className="back-type">{back.type}</p>
                          <p className="back-example">{back.example}</p>
                        </div>
                        <img src={back.image ? back.image : ''} className={back.image ? '' : 'd-none'} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        }}
      />
    );
  };

  render() {
    let table = this.table();
    return (
      <div>
        <div className="deck-fields">
          <div className="deck-back">
            <Link to="/publicdecks">Back</Link>
          </div>
          <div className="deck-content">
            <div class="deck-content-info">
              <div class="deck-title">Info</div>
              <div class="deck-content-info-line">
                Deck name: {this.state.deckData.name}
              </div>
              <div class="deck-content-info-line">
                Number of cards: {this.state.deckData.totalCards}
              </div>
              <div class="deck-content-info-line">
                Description: {this.state.deckData.description}
              </div>
              <div class="deck-content-info-line">
                Date created: {new Date(this.state.deckData.createdDate).toLocaleDateString()}
              </div>
              <div class="deck-content-info-line">
                Category: {this.state.deckData.category && this.state.deckData.category.name}
              </div>
              <div class="deck-content-info-line">
                Author: {this.state.deckData.author && this.state.deckData.author.displayName}
              </div>
              <div class="deck-content-info-line">
                Contributors: {this.state.deckData.contributors ?
                  this.state.deckData.contributors.map((cont) => cont.displayName).join(', ') : ''
                }
              </div>
            </div>

            <div className="deck-content-advanced">
              <div class="deck-content-advanced-features">
                <div class="deck-title">Features</div>
              </div>
              <div class="deck-content-advanced-features-items">
                <div className="deck-feature">

                  {this.state.deckData.had === true ?
                    <p>
                      <i className="far fa-arrow-to-bottom" style={{ color: "#666" }}></i>
                      <button
                        className="downloaded"
                        onClick={(event) => this.onClickDownloaded(event)}
                      >
                        Downloaded
                      </button>
                    </p> :
                    <p>
                      <i className="far fa-arrow-to-bottom" style={{ color: "#007bff" }}></i>
                      <button
                        className="download"
                        onClick={(event) => this.onClickDownload(event, this.state.id)}
                      >
                        Download
                      </button>
                    </p>}
                  <p>
                    <i class="far fa-hand-paper" style={{ color: "#007bff" }}></i>
                    <Link to={'/proposal/' + this.state.id} className="download propose">Propose Cards</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="table">{table}</div>
        </div>
      </div>
    );
  }
}

export default PublicDeckDetail;
