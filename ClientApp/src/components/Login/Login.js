import React, { Component } from 'react';
import { Route } from 'react-router';
import Button from '@material-ui/core/Button';
import {
	BrowserRouter as Router,
	Switch,
	Link,
	Redirect,
	withRouter
} from 'react-router-dom';
import SignUp from '../SignUp/SignUp';
// import Portal from '../Portal/Portal';
import Dashboard from '../Users/Dashboard/Dashboard';
import './Login.css';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirectDashboard: false,
			redirectSignUp: false,
		};
	}

	onLoginClick = () => {
		this.setState({
			redirectDashboard: true
		});
	};

	onSignUpClick = () => {
		this.setState({
			redirectSignUp: true
		});
	};

	render() {
		const { redirectDashboard, redirectSignUp } = this.state;

		if (redirectDashboard) {
			return <Redirect to="/dashboard" Component={Dashboard} />;
		}

		if (redirectSignUp) {
			return <Redirect to="/signup" Component={SignUp} />;
		}
		return (
			<Router>
				<div className="wrap">
					<div className="wrap-form">
						<h4 className="wrap-form-title">Login</h4>
						<div className="input-field wrap-form-input">
							<input id="username" type="text" className="validate" />
							<label for="username">Username:</label>
						</div>
						<div className="input-field wrap-form-input">
							<input id="password" type="password" className="validate" />
							<label for="password">Password:</label>
						</div>
						{/* <Link to="/dashboard"> */}
						<Button
							className="wrap-form-button"
							onClick={this.onLoginClick}
							type="button"
							color="primary"
						>
							Login
						</Button>
						<br></br>
						{/* </Link> */}
						<Button
							className="wrap-form-button-white"
							onClick={this.onSignUpClick}
							type="button"
							color="primary"
						>
							Sign up
						</Button>

						<hr></hr>

						<Button
							className="wrap-form-button-white"
							onClick={this.onChange}
							type="button"
							color="primary"
						>
							Sign in with Facebook
						</Button>
						<Button
							className="wrap-form-button-white"
							onClick={this.onChange}
							type="button"
							color="primary"
						>
							Sign in with Google
						</Button>
					</div>
				</div>
			</Router>
		);
	}
}

export default withRouter(Login);
