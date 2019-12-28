import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import MaterialTable from 'material-table';
import Dashboard from '../Dashboard/Dashboard';
import AddCards from '../AddCards/AddCards';

import Button from '@material-ui/core/Button';
import Select from 'react-select';
import { BrowserRouter as Router, Redirect, Link } from 'react-router-dom';

import '../CreateDeck/CreateDeck.css';
import DeckDetail from '../DeckDetail/DeckDetail';

class EditDeck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      selectedOption: null,
      categories: {},
      deckData: {},
      redirectToDeck: false,
    };
  }

  componentWillMount() {
    var deckID = this.getDeckIDFromPath();
    this.setState({
      id: deckID
    });
  }

  componentDidMount() {
    this.getCategories();
    this.getDeckData();
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
    const data = await response.json();
    this.setState({ categories: data, loading: false });
  };

  getDeckData = async () => {
    var url = '/api/decks/' + this.state.id;
    const token = await authService.getAccessToken();
    const response = await fetch(url, {
      headers: !token ? {} : { Authorization: `Bearer ${token}` }
    });
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      this.setState({
        deckData: data,
        selectedOption: {
          value: data.category.id,
          label: data.category.name
        },
        loading: false
      });
    }
  };

  editDeck = async () => {
    var deckName = document.getElementById('dname').value;
    var description = document.getElementById('des').value;
    var categories = this.state.selectedOption.value;

    const url = '/api/decks/' + this.state.id;
    const token = await authService.getAccessToken();
    const data = {
      name: deckName,
      description: description,
      category: {
        id: categories
      }
    };
    
    const response = await fetch(url, {
      method: 'PUT', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.status === 204) {
      this.setState({ redirectToDeck: true });
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

    if (this.state.redirectToDeck === true) {
      return <Redirect to={'/decks/' + this.state.id} Component={DeckDetail} />;
    }

    if (this.state.categories.length !== undefined) {
      categories = this.transData();
    }
    return (
      <div>
        <Link to={'/decks/' + this.state.id}>Back</Link>
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
              <input type="text" id="dname" name="dname" defaultValue={this.state.deckData && this.state.deckData.name} />
              <label for="lname">Description</label>
              <input type="text" id="des" name="des" defaultValue={this.state.deckData && this.state.deckData.description} />

              <Button
                className="button-submit"
                onClick={this.editDeck}
                type="button"
                color="primary"
              >
                <p>Done</p>
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default EditDeck;