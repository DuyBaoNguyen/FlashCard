import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import ProposeCardForDeck from '../ProposeCardForDeck/ProposeCardForDeck';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import { BrowserRouter as Router, Redirect, Link } from 'react-router-dom';

class ProposeDeck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      redirectProposeCards: false,
      selectedOption: null,
      categories: {},
    };
  }

  componentDidMount() {
    this.getCategories();
  }

  getDeckIDFromPath = url => {
    return this.props.match.params.deckId;
  };

  getCategories = async () => {
    var url = '/api/categories';
    const token = await authService.getAccessToken();
    const response = await fetch(url, {
      headers: !token ? {} : { Authorization: `Bearer ${token}` }
    });

    if (response.status === 200) {
      const data = await response.json();
      this.setState({ categories: data, loading: false });
    }
  };

  proposeDeck = async () => {
    var deckName = document.getElementById('dname').value;
    var description = document.getElementById('des').value;
    var categories = this.state.selectedOption.value;

    const url = '/api/proposeddecks/';
    const token = await authService.getAccessToken();
    const data = {
      name: deckName,
      description: description,
      category: {
        id: categories
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.status === 201) {
      const json = await response.json();
      this.setState({
        id: JSON.stringify(json.id),
        redirectProposeCards: true,
      });
    }
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption }, () =>
      console.log(`Option selected:`, this.state.selectedOption)
    );
  };

  transData = () => {
    var array = [];
    var cate = Object.create(null);
    var categoriesList = this.state.categories;
    if (categoriesList !== undefined) {
      categoriesList.map(category => {
        cate = {
          value: category.id,
          label: category.name
        };
        array.push(cate);
      });
    }
    return array;
  };

  render() {
    var categories;
    var url;
    const { selectedOption } = this.state;
    if (this.state.redirectProposeCards === true) {
      url = "/proposal/" + this.state.id;
      return <Redirect to={url} Component={ProposeCardForDeck} />;
    }
    if (this.state.categories.length !== undefined) {
      categories = this.transData();
    }
    return (
      <div>
        <Link to="/publicdecks">Back</Link>
        <div className="add-deck-field">
          <div className="field-content">
            <form action="/action_page.php">
              <label for="fname">Category</label>
              <Select
                className="select"
                value={selectedOption}
                onChange={this.handleChange}
                options={categories}
              />
              <hr />
              <label for="fname">Deck name</label>
              <input type="text" id="dname" name="dname" />
              <label for="lname">Description</label>
              <input type="text" id="des" name="des" />

              <Button
                className="button-submit"
                onClick={this.proposeDeck}
                type="button"
                color="primary"
              >
                <p>Propose</p>
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ProposeDeck;
