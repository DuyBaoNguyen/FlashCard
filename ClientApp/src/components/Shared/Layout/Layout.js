import React, { Component } from 'react';
import { NavMenu } from '../Navigation/NavMenu';

import './Layout.css';

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div>
        <NavMenu />
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}
