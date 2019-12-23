import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import { BrowserRouter as Router, Redirect, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './AdminUsers.css';
import MaterialTable from 'material-table';
import classnames from 'classnames';

class AdminUsers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userData : []
		};
	}

	componentWillMount() {

	}

	componentDidMount() {
		this.getUsers();
	}

	getUsers = async () => {
		var url = '/api/users';
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});
		const data = await response.json();
		console.log(token);
		this.setState({ userData: data, loading: false });
	}

	
	table = () => {
		return (
      <MaterialTable
        title="User management"
        columns={[
					{ title: 'Email', field: 'email' },
          { title: 'Name', field: 'displayName' },
        ]}
        data={this.state.userData}
        detailPanel={rowData => {
          return (
            <div className="user-detail">
							<div className="user-detail-info">
								<div className="user-detail-info-title">Id :</div>
								<div className="user-detail-info-data">{rowData.id}</div>
							</div>
							<div className="user-detail-info">
								<div className="user-detail-info-title">Username :</div>
								<div className="user-detail-info-data">{rowData.userName}</div>
							</div>

							<div className="user-detail-info">
								<div className="user-detail-info-title">Display Name :</div>
								<div className="user-detail-info-data">{rowData.displayName}</div>
							</div>
							<div className="user-detail-info">
								<div className="user-detail-info-title">Email :</div>
								<div className="user-detail-info-data">{rowData.email}</div>
							</div>

							<div className="user-detail-info">
								<div className="user-detail-info-title">Role :</div>
								<div className="user-detail-info-data">{rowData.role}</div>
							</div>
						</div>
          )
        }}
      />
    )
	};

	render() {
		// console.log(this.props.match.params.deckId);
		// console.log();
	let table = this.table();
		return (
			<div>
				{/* <h5>User management</h5>
				<hr /> */}
				{table}
			</div>
				
		);
	}
}

export default AdminUsers;
