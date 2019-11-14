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
import Login from '../Login/Login';
import './SignUp.css';

class SignUp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirectLogin: false
		};
	}

	onChange = () => {
		alert("Success!")
		this.setState({
			redirectLogin: true
		});
	};

	render() {
		const { redirectLogin } = this.state;
		if (redirectLogin) {
			return <Redirect to="/" Component={Login} />;
		}
		return (
			<Router>
				<div className="signup">
					<div className="signup-form">
						<h4 className="signup-form-title">Sign up</h4>
						<div className="input-field signup-form-input">
							<input id="username" type="text" className="validate" />
							<label for="username">Username:</label>
						</div>
						<div className="input-field signup-form-input">
							<input id="password" type="password" className="validate" />
							<label for="password">Password:</label>
						</div>
						<div className="input-field signup-form-input">
							<input id="retypepassword" type="password" className="validate" />
							<label for="password">Re-type password:</label>
						</div>
						<div className="input-field signup-form-input">
							<input id="name" type="text" className="validate" />
							<label for="name">Name:</label>
						</div>
						<div className="input-field signup-form-input">
							<input id="email" type="email" className="validate" />
							<label for="email">Email:</label>
						</div>
						{/* <Link to="/dashboard"> */}
						<Button
							className="signup-form-button"
							onClick={this.onChange}
							type="button"
							color="primary"
						>
							Sign Up
						</Button>
					</div>
				</div>
			</Router>
		);
	}
}

export default withRouter(SignUp);
