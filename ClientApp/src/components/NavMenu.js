import React, { Component, Fragment } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LoginMenu } from './api-authorization/LoginMenu';
import './NavMenu.css';
import authService from './api-authorization/AuthorizeService';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
      user: null
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  componentDidMount() {
    this.populateState();
  }

  async populateState() {
    const currentUser = await authService.getUser();
    this.setState({
      user: currentUser
    });
  }

  render() {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
          <Container>
            <NavbarBrand tag={Link} to="/">FlashCard</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/">Dashboard</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/cards">Cards</NavLink>
                </NavItem>
                {this.state.user && this.state.user.role === 'user' ?
                  <Fragment>
                    <NavItem>
                      <NavLink tag={Link} className="text-dark" to="/publiccards">Public Cards</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} className="text-dark" to="/publicdecks">Public Decks</NavLink>
                    </NavItem>
                  </Fragment> : 
                  ''
                }
                <LoginMenu user={this.state.user}>
                </LoginMenu>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
