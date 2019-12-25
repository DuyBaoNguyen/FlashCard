import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import MaterialTable from 'material-table';
import { Link } from 'react-router-dom';

class ProposeCardForDeck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      deckData: {},
      cardsSource: {},
      cardsInDeck: {},
      proposals: {}
    };
  }

  componentWillMount() {
    var deckID = this.getDeckIDFromPath();
    this.setState({
      id: deckID
    });
  }

  componentDidMount() {
    this.getDeckData();
    this.getCardsSource();
    this.getCardsInDeck();
    this.getProposals();
  }

  getDeckIDFromPath = url => {
    return this.props.match.params.deckId;
  };

  getDeckData = async () => {
    var url = '/api/proposeddecks/' + this.state.id;
    const token = await authService.getAccessToken();
    const response = await fetch(url, {
      headers: !token ? {} : { Authorization: `Bearer ${token}` }
    });

    if (response.status === 200) {
      const data = await response.json();
      this.setState({ deckData: data, loading: false });
    }
  };

  getCardsInDeck = async () => {
    var url = '/api/proposeddecks/' + this.state.id + '/cards';
    const token = await authService.getAccessToken();
    const response = await fetch(url, {
      headers: !token ? {} : { Authorization: `Bearer ${token}` }
    });

    if (response.status === 200) {
      const data = await response.json();
      this.setState({ cardsInDeck: data, loading: false });
    }
  };

  getCardsSource = async () => {
    var url = '/api/proposeddecks/' + this.state.id + '/remainingcards';
    const token = await authService.getAccessToken();
    const response = await fetch(url, {
      headers: !token ? {} : { Authorization: `Bearer ${token}` }
    });

    if (response.status === 200) {
      const data = await response.json();
      this.setState({ cardsSource: data, loading: false });
    }
  };

  getProposals = async () => {
    var url = '/api/proposeddecks/' + this.state.id + '/proposals';
    const token = await authService.getAccessToken();
    const response = await fetch(url, {
      headers: !token ? {} : { Authorization: `Bearer ${token}` }
    });

    if (response.status === 200) {
      const data = await response.json();
      this.setState({ proposals: data, loading: false });
    }
  };

  transData = param => {
    var mockData = [];
    var oldVocab = Object.create(null);
    var data = param;
    if (data != undefined) {
      data.map((vocab, index) => {
        oldVocab = {
          id: vocab.id,
          front: vocab.front,
          backs: vocab.backs
            .map((back, index2) => back.meaning)
            .join(' - '),
          originBacks: vocab.backs
        };
        mockData.push(oldVocab);
      });
      return mockData;
    }
  };

  transProposalData = param => {
    var mockData = [];
    var oldVocab = Object.create(null);
    var data = param;
    if (data != undefined) {
      data.map((proposal, index) => {
        oldVocab = {
          id: proposal.card.id,
          front: proposal.card.front,
          backs: proposal.card.backs
            .map((back, index2) => back.meaning)
            .join(' - '),
          originBacks: proposal.card.backs,
          proposalId: proposal.id
        };
        mockData.push(oldVocab);
      });
      return mockData;
    }
  };

  addCard = async param => {
    var url = '/api/proposeddecks/' + this.state.id + '/proposals';
    const token = await authService.getAccessToken();
    const data = { cardId: param };
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      this.getCardsSource();
      this.getProposals();
    }
  };

  deleteProposal = async proposalId => {
    var url = '/api/proposals/' + proposalId;
    const token = await authService.getAccessToken();
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 204) {
      this.getCardsSource();
      this.getProposals();
    }
  }

  cardsInDeck = () => {
    if (this.state.cardsInDeck.length !== undefined) {
      var data = this.transData(this.state.cardsInDeck);
    }
    var title = 'Card in deck: ' + this.state.deckData.name;
    return (
      <MaterialTable
        title={title}
        columns={[
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
                        {back.fromAdmin ? <h6 class="w-auto"><span class="badge badge-success">From Admin</span></h6> : ''}
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
        // options={{
        //   pageSize: 7
        // }}
      />
    );
  };

  cardsSource = () => {
    if (this.state.cardsSource.length !== undefined) {
      var data = this.transData(this.state.cardsSource);
    }
    var title = 'Card source';
    return (
      <MaterialTable
        title={title}
        columns={[
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
                        {back.fromAdmin ? <h6 class="w-auto"><span class="badge badge-success">From Admin</span></h6> : ''}
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
        actions={[
          {
            icon: 'add',
            tooltip: 'Add card',
            // eslint-disable-next-line no-restricted-globals
            onClick: (event, rowData) => this.addCard(rowData.id)
          }
        ]}
        // options={{
        //   pageSize: 7
        // }}
      />
    );
  };

  proposals = () => {
    if (this.state.proposals.length !== undefined) {
      var data = this.transProposalData(this.state.proposals);
    }
    var title = 'Proposals';
    return (
      <MaterialTable
        title={title}
        columns={[
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
                        {back.fromAdmin ? <h6 class="w-auto"><span class="badge badge-success">From Admin</span></h6> : ''}
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
        actions={[
          {
            icon: 'delete',
            tooltip: 'Delete Proposal',
            // eslint-disable-next-line no-restricted-globals
            onClick: (event, rowData) => this.deleteProposal(rowData.proposalId)
          }
        ]}
        // options={{
        //   pageSize: 7
        // }}
      />
    );
  };

  redirectAddCards = () => {
    this.setState({
      redirectAddCards: true
    });
  };

  render() {
    var cardsInDeck = this.cardsInDeck();
    var cardsSource = this.cardsSource();
    var proposals = this.proposals();

    return (
      <div>
        <Link to={'/publicdecks/'}>Done</Link>
        <div className="add-field">
          <div className="deck-table">{cardsInDeck}</div>
          <div className="deck-cards">{cardsSource}</div>
        </div>
        <div className="deck-proposals">{proposals}</div>
      </div>
    );
  }
}

export default ProposeCardForDeck;
