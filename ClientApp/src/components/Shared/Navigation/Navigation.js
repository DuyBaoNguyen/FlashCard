import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Icon } from '@iconify/react';
import changePasswordIcon from '@iconify/icons-uil/lock';
import logoutIcon from '@iconify/icons-uil/signout';
import arrowDown from '@iconify/icons-uil/angle-down';
import { connect } from 'react-redux';

import Container from '../Container/Container';
import NavigationItem from './NavigationItem/NavigationItem';
import DropDown from '../DropDown/DropDown';
import DropDownItem from '../DropDownItem/DropDownItem';
import PasswordUpdatingForm from '../../User/PasswordUpdatingForm/PasswordUpdatingForm';
import authService from '../../api-authorization/AuthorizeService';
import { ApplicationPaths } from '../../api-authorization/ApiAuthorizationConstants';
import * as actions from '../../../store/actions';
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

  handleOpenPasswordUpdatingForm = () => {
    this.props.onTogglePasswordUpdatingForm(true);
  }

  handleClosePasswordUpdatingForm = () => {
    this.props.onTogglePasswordUpdatingForm(false);
  }

  render() {
    const { passwordUpdatingFormOpened } = this.props;
    let navigation;

    if (this.state.isAuthenticated) {
      const { profile } = this.props;
      const name = this.props.profile?.displayName || 'User';
      const logoutPath = {
        pathname: ApplicationPaths.LogOut,
        state: { local: true }
      };

      navigation = (
        <ul className="navigation-items">
          <NavigationItem to="/" exact label="Home" />
          <NavigationItem to="/cards" label="My cards" />
          {profile?.role === 'user' && (
            <NavigationItem to="/market" label="Market" />
          )}
          {profile?.role === 'administrator' && (
            <>
              <NavigationItem to="/admin/users" label="Users" />
              <NavigationItem to="/admin/cardproposals" label="Card Proposals" />
            </>
          )}
          <DropDown
            label={`Hi, ${name}!`}
            right
            postfix={<Icon icon={arrowDown} color="#fff" style={{ fontSize: 20 }} />}
            className="navigation-options">
            <DropDownItem
              type="button"
              icon={<Icon icon={changePasswordIcon} />}
              label="Change password"
              onClick={this.handleOpenPasswordUpdatingForm} />
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
        <PasswordUpdatingForm 
          isOpen={passwordUpdatingFormOpened} 
          onClose={this.handleClosePasswordUpdatingForm} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    profile: state.home.profile,
    passwordUpdatingFormOpened: state.home.passwordUpdatingFormOpened
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTogglePasswordUpdatingForm: (value) => dispatch(actions.togglePasswordUpdatingForm(value))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigation));