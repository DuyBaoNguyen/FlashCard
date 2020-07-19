import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Pagination from 'react-js-pagination';

import Loading from '../../Shared/Loading/Loading';
import withErrorHandler from '../../../hoc/withErrorHandler';
import * as actions from '../../../store/actions';
import { TIME_OUT_DURATION } from '../../../applicationConstants';
import './ProposedPublicDecks.css';

const AMOUNT_DECKS = 12;

class ProposedPublicDecks extends Component {
  state = {
    activePage: 1,
    setLoading: false
  };

  componentDidMount() {
    this.props.onGetDecks();

    if (!this.state.setLoading) {
      setTimeout(() => {
        if (this.props.loading) {
          this.setState({ setLoading: true });
        }
      }, TIME_OUT_DURATION);
    }
  }

  handlePageChanged = (pageNumber) => {
    this.setState({ activePage: pageNumber });
  }

  render() {
    const { decks, loading, location } = this.props;
    let { activePage, setLoading } = this.state;
    let decksTable = loading ? setLoading && <Loading /> : <p className="text-notify">There are no decks here!</p>;
    let pagination;

    if (decks.length > 0 && !loading) {
      decksTable = (
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Deck</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            {decks
              .filter((_, index) => index >= (activePage - 1) * AMOUNT_DECKS && index <= activePage * AMOUNT_DECKS - 1)
              .map((deck, index) => {
                return (
                  <tr key={deck.id}>
                    <td>
                      <Link to={{ pathname: `/admin/publicdecks/${deck.id}`, state: { backUrl: location.pathname } }}>
                        {(activePage - 1) * AMOUNT_DECKS + index + 1}
                      </Link>
                    </td>
                    <td>
                      <Link to={{ pathname: `/admin/publicdecks/${deck.id}`, state: { backUrl: location.pathname } }}>
                        {deck.name}
                      </Link>
                    </td>
                    <td>
                      <Link to={{ pathname: `/admin/publicdecks/${deck.id}`, state: { backUrl: location.pathname } }}>
                        {deck.owner.name}
                      </Link>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      );

      pagination = (
        <Pagination
          hideFirstLastPages
          prevPageText="<"
          nextPageText=">"
          activePage={activePage}
          itemsCountPerPage={AMOUNT_DECKS}
          totalItemsCount={decks.length}
          pageRangeDisplayed={5}
          onChange={this.handlePageChanged}
          activeClass="pagination-item-active"
          itemClass="pagination-item"
        />
      );
    }

    return (
      <div className="proposed-public-decks-wrapper">
        <div className="proposed-public-decks-header">
          <p>Public decks</p>
        </div>
        {decksTable}
        <div className="proposed-public-decks-pagination">{pagination}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    decks: state.publicDecksManagement.publicDecks,
    loading: state.publicDecksManagement.getPublicDecksLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetDecks: () => dispatch(actions.getProposedPublicDecks())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ProposedPublicDecks)));