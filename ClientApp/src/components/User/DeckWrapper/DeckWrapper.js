import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from 'react-js-pagination';
import { Button, Input } from 'antd';
import { Icon } from '@iconify/react';
import plusIcon from '@iconify/icons-uil/plus';
import searchIcon from '@iconify/icons-uil/search';

import * as actions from '../../../store/actions';
import Deck from './Deck/Deck';

import './DeckWrapper.css';

class DeckWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1
    };
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber });
  }

  componentDidMount() {
    this.props.onGetDecks('');
  }

  searchDeckHandler = (event) => {
    this.props.onGetDecks(event.target.value);
    this.setState({ activePage: 1 });
  }

  render() {
    console.log(this.props.decks);
    let deckList = <p>There are no decks here!</p>;
    let pagination;

    if (this.props.decks !== null && this.props.decks.length > 0) {
      deckList = this.props.decks.map((deck, index) => {
        return (
          <>
            {index >= (this.state.activePage - 1) * 4 && index <= this.state.activePage * 4 - 1 && (
              <Deck key={deck.id} deck={deck} />
            )}
          </>
        );
      });

      pagination = (
        <Pagination
          hideFirstLastPages
          prevPageText="<"
          nextPageText=">"
          activePage={this.state.activePage}
          itemsCountPerPage={4}
          totalItemsCount={
            this.props.decks !== null ? this.props.decks.length : null
          }
          pageRangeDisplayed={5}
          onChange={this.handlePageChange.bind(this)}
          activeClass="pagination-item-active"
          itemClass="pagination-item"
        />
      );
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
            <Input
              className="deck-header-features-search"
              placeholder="Search..."
              prefix={<Icon icon={searchIcon} color="#aaa" />}
              onChange={(event) => this.searchDeckHandler(event)}
            />
          </div>
        </div>
        <br />
        <div className="decks">{deckList}</div>
        <div className="deck-pagination">
          {pagination}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    decks: state.home.decks,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetDecks: (name) => dispatch(actions.getDecks(name)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeckWrapper);
