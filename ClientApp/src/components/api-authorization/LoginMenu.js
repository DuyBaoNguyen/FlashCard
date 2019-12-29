import React, { Component, Fragment } from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import authService from './AuthorizeService';
import { ApplicationPaths } from './ApiAuthorizationConstants';

export class LoginMenu extends Component {
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
        this.setState({
            isAuthenticated
        });
    }

    render() {
        const { isAuthenticated } = this.state;
        if (!isAuthenticated) {
            const registerPath = `${ApplicationPaths.Register}`;
            const loginPath = `${ApplicationPaths.Login}`;
            return this.anonymousView(registerPath, loginPath);
        } else {
            const profilePath = `${ApplicationPaths.Profile}`;
            const logoutPath = { pathname: `${ApplicationPaths.LogOut}`, state: { local: true } };
            return this.authenticatedView(this.props.user, profilePath, logoutPath);
        }
    }

    authenticatedView(user, profilePath, logoutPath) {
        return (<Fragment>
            { user && user.role !== 'user' ?
                <Fragment>
                    <NavItem>
                        <NavLink tag={Link} className="text-dark" to="/users">Users</NavLink>
                    </NavItem> 
                    <NavItem>
                        <NavLink tag={Link} className="text-dark" to="/admin/propose">Proposals</NavLink>
                    </NavItem>
                </Fragment> : 
                ''
            }
            <NavItem>
                <span className="nav-link text-dark">Hello {user && user.displayName}</span>
            </NavItem>
            <NavItem>
                <NavLink tag={Link} className="text-dark" to={logoutPath}>Logout</NavLink>
            </NavItem>
        </Fragment>);

    }

    anonymousView(registerPath, loginPath) {
        return (<Fragment>
            <NavItem>
                <NavLink tag={Link} className="text-dark" to={registerPath}>Register</NavLink>
            </NavItem>
            <NavItem>
                <NavLink tag={Link} className="text-dark" to={loginPath}>Login</NavLink>
            </NavItem>
        </Fragment>);
    }
}
