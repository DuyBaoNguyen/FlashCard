import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import userIcon from '@iconify/icons-uil/user';
import logoutIcon from '@iconify/icons-uil/arrow-left';
import arrowDown from '@iconify/icons-uil/angle-down';

import Container from '../Container/Container';
import NavigationItem from './NavigationItem/NavigationItem';
import NavigationDropDown from './NavigationDropDown/NavigationDropDown';
import authService from '../../api-authorization/AuthorizeService';
import { ApplicationPaths } from '../../api-authorization/ApiAuthorizationConstants';
import './Navigation.css';

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false
    };
  }

  componentDidMount() {
    this._subscription = authService.subscribe(() => this.populateState());
    this.populateState();
  }

  componentWillUnmount() {
    authService.unsubscribe(this._subscription);
  }

  async populateState() {
    const isAuthenticated = await authService.isAuthenticated();
    this.setState({ isAuthenticated });
  }

  render() {
    let navigation;
    if (this.state.isAuthenticated) {
      const dropDownLabel = (
        <span>
          Hi, User!
          <Icon icon={arrowDown} style={{ fontSize: 20 }} />
        </span>
      );
      const dropDownItems = [
        {
          icon: userIcon,
          label: 'Profile',
          to: '/profile'
        },
        {
          icon: logoutIcon,
          label: 'Logout',
          to: { pathname: ApplicationPaths.LogOut, state: { local: true } }
        }
      ];

      navigation = (
        <ul className="navigation-items">
          <NavigationItem to="/" exact label="Home" />
          <NavigationItem to="/cards" label="My cards" />
          <NavigationItem to="/market" label="Market" />
          <NavigationDropDown items={dropDownItems} label={dropDownLabel} />
        </ul>
      );
    }

    return (
      <div className="navigation-wrapper">
        <Container className="container">
          <div className="navigation">
            <Link to="/" className="brand">FlashCard</Link>
            {navigation}
          </div>
        </Container>
      </div>
    );
  }
}

export default Navigation;