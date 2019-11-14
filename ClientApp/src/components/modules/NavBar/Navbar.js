import React, { Component } from 'react';

import './Navbar.css';

class Navbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false
		};
	}

	render() {
		return (
			<div className="nav">
    <div className="nav-title">
      <p>{ this.props.navTitle }</p>
    </div>
    <div className="nav-logout">
      <a>Logout</a>
    </div>
  </div>
		);
	}
	}


export default Navbar;
