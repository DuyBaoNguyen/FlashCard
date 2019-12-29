import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './AdminPropose.css';
import Navbar from '../../modules/NavBar/Navbar';
import AdminUsers from '../AdminUsers/AdminUsers';
import AdminProposeCards from '../AdminProposeCards/AdminProposeCards';
import AdminProposeDecks from '../AdminProposeDecks/AdminProposeDecks';

class AdminPropose extends Component {
	render() {
		const tabs = (<Tabs>
			<TabList>
				<Tab>Cards</Tab>
				<Tab>Decks</Tab>

			</TabList>
	
			<TabPanel>
				<h2><AdminProposeCards/></h2>
			</TabPanel>
			<TabPanel>
				<h2><AdminProposeDecks/></h2>
			</TabPanel>
		</Tabs>);
		return (
			<div>
				{tabs}
			</div> 
		);
	}
}

export default AdminPropose;
