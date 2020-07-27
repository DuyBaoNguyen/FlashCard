import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from 'react-js-pagination';
import { Icon } from '@iconify/react';
import plusIcon from '@iconify/icons-uil/plus';

import Search from '../../Shared/Search/Search';
import Button from '../../Shared/Button/Button';
import Filter from '../../Shared/Filter/Filter';
import Loading from '../../Shared/Loading/Loading';
import * as actions from '../../../store/actions';
import Deck from '../DeckWrapper/Deck/Deck';
import { TIME_OUT_DURATION } from '../../../applicationConstants';
import './Shortcuts.css';

const AMOUNT_SHORTCUTS = 4;

class Shortcuts extends Component {
  state = {
    activePage: 1,
    setLoading: false
  };

  handleChangePage = (pageNumber) => {
    this.setState({ activePage: pageNumber });
  }

  componentDidMount() {
    this.props.onGetShortcuts();

    if (!this.state.setLoading) {
      setTimeout(() => {
        if (this.props.loading) {
          this.setState({ setLoading: true });
        }
      }, TIME_OUT_DURATION);
    }
  }

  handleSearchShortcuts = (event) => {
    const value = event.target.value;
    this.props.onUpdateShortcutsSearchString(value);
    this.props.onGetShortcuts(value);
    this.setState({ activePage: 1 });
  };

  handleFilteredValueChange = (event) => {
    const value = event.target.value;
    this.props.onUpdateShortcutsFilteredValue(value);
    this.props.onFilterShortcuts(value);
    this.setState({ activePage: 1 });
  }

  handleChangeTab = () => {
    this.props.onChangeHomeTab(1);
  }

  render() {
    const { loading, shortcuts, searchString, filteredValue } = this.props;
    const { setLoading, activePage } = this.state;
    let shortcutsList = loading ? setLoading && <Loading /> : <p className="text-notify">There are no shortcuts here!</p>;
    let pagination;

    if (shortcuts.length > 0 && !loading) {
      shortcutsList = (
        <div className="shortcuts">
          {shortcuts
            .filter((_, index) => index >= (activePage - 1) * AMOUNT_SHORTCUTS && index <= activePage * AMOUNT_SHORTCUTS - 1)
            .map(deck => <Deck key={deck.id} deck={deck} />)}
        </div>
      );

      pagination = (
        <Pagination
          hideFirstLastPages
          prevPageText="<"
          nextPageText=">"
          activePage={activePage}
          itemsCountPerPage={AMOUNT_SHORTCUTS}
          totalItemsCount={shortcuts.length}
          pageRangeDisplayed={5}
          onChange={this.handleChangePage}
          activeClass="pagination-item-active"
          itemClass="pagination-item"
        />
      );
    }

    return (
      <div className="shortcuts-wrapper">
        <div className="shortcuts-header">
          <div className="shortcuts-header-labels">
            <span className="shortcuts-header-active-label">My shortcuts</span>
            <span
              className="shortcuts-header-label" 
              onClick={this.handleChangeTab}>
              My decks
            </span>
          </div>
          <div className="shortcuts-header-features">
            <Button
              className="shortcuts-header-features-add"
              type="link"
              path="/createdeck"
              icon={<Icon icon={plusIcon} />}>
            </Button>
            <Filter
              className="shortcuts-header-features-filter"
              value={filteredValue}
              onChange={this.handleFilteredValueChange}>
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="not completed">Not completed</option>
            </Filter>
            <Search
              placeholder="Search..."
              value={searchString}
              onChange={this.handleSearchShortcuts}
            />
          </div>
        </div>
        <br />
        {shortcutsList}
        <div className="shortcuts-pagination">{pagination}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    shortcuts: state.home.shortcuts,
    loading: state.home.loadings.getShortcutsLoading,
    searchString: state.home.shortcutsSearchString,
    filteredValue: state.home.filteredValues.shortcutsFilteredValue
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetShortcuts: (name) => dispatch(actions.getShortcuts(name)),
    onFilterShortcuts: (filteredValue) => dispatch(actions.filterShortcuts(filteredValue)),
    onUpdateShortcutsFilteredValue: (value) => dispatch(actions.updateShortcutsFilteredValue(value)),
    onUpdateShortcutsSearchString: (value) => dispatch(actions.updateShortcutsSearchString(value)),
    onChangeHomeTab: (tab) => dispatch(actions.changeHomeTab(tab))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Shortcuts);
