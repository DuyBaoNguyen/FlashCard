import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Icon } from '@iconify/react';
import userIcon from '@iconify/icons-uil/user';
import logoutIcon from '@iconify/icons-uil/signout';
import arrowDown from '@iconify/icons-uil/angle-down';
import { connect } from 'react-redux';

import Container from '../Container/Container';
import NavigationItem from './NavigationItem/NavigationItem';
import DropDown from '../DropDown/DropDown';
import DropDownItem from '../DropDownItem/DropDownItem';
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
      const name = this.props.profile?.displayName || 'User';
      const logoutPath = {
        pathname: ApplicationPaths.LogOut,
        state: { local: true }
      };

      navigation = (
        <ul className="navigation-items">
          <NavigationItem to="/" exact label="Home" />
          <NavigationItem to="/cards" label="My cards" />
          <NavigationItem to="/market" label="Market" />
          <DropDown
            label={`Hi, ${name}!`}
            right
            postfix={<Icon icon={arrowDown} color="#fff" style={{ fontSize: 20 }} />}
            className="navigation-options">
            <DropDownItem
              type="link"
              path="/profile"
              icon={<Icon icon={userIcon} />}
              label="Profile" />
            <DropDownItem
              type="link"
              path={logoutPath}
              icon={<Icon icon={logoutIcon} />}
              label="Logout" />
          </DropDown>
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

const mapStateToProps = state => {
  return {
    profile: state.home.profile
  };
};

export default withRouter(connect(mapStateToProps)(Navigation));