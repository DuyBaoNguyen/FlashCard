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
			userData: []
		};
	}

	componentWillMount() {

	}

	componentDidMount() {
		this.getUsers();
	}

	getUsers = async () => {
		console.log("hihi");
		var url = '/api/users';
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			headers: !token ? {} : { Authorization: `Bearer ${token}` }
		});
		const data = await response.json();
		console.log(token);
		this.setState({ userData: data, loading: false });
	}

	onClickDeleteUser = async userId => {
		Swal.fire({
			title: 'Are you sure to delete this user?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			cancelButtonColor: '#b3b3b3',
			confirmButtonColor: '#DD3333',
			confirmButtonText: 'Yes, delete it!'
		}).then(result => {
			if (result.value) {
				this.deleteUser(userId);
			}
		});
	};

	deleteUser = async userId => {
		var url = '/api/users/' + userId;
		const token = await authService.getAccessToken();
		const response = await fetch(url, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});

		if (response.status === 204) {
			this.getUsers();
		}
	};

	table = () => {
		return (
			<MaterialTable
				title="User management"
				columns={[
					{ title: 'Id', field: 'id' },
					{ title: 'Email', field: 'email' },
					{ title: 'Name', field: 'displayName' },
					{ title: 'Role', field: 'role' }
				]}
				data={this.state.userData}
				// detailPanel={rowData => {
				//   return (
				//     <div className="user-detail">
				// 			<div className="user-detail-info">
				// 				<div className="user-detail-info-title">Id :</div>
				// 				<div className="user-detail-info-data">{rowData.id}</div>
				// 			</div>
				// 			<div className="user-detail-info">
				// 				<div className="user-detail-info-title">Username :</div>
				// 				<div className="user-detail-info-data">{rowData.userName}</div>
				// 			</div>

				// 			<div className="user-detail-info">
				// 				<div className="user-detail-info-title">Display Name :</div>
				// 				<div className="user-detail-info-data">{rowData.displayName}</div>
				// 			</div>
				// 			<div className="user-detail-info">
				// 				<div className="user-detail-info-title">Email :</div>
				// 				<div className="user-detail-info-data">{rowData.email}</div>
				// 			</div>

				// 			<div className="user-detail-info">
				// 				<div className="user-detail-info-title">Role :</div>
				// 				<div className="user-detail-info-data">{rowData.role}</div>
				// 			</div>
				// 		</div>
				//   )
				// }}
				actions={[
					{
						icon: 'delete',
						tooltip: 'Delete user',
						// eslint-disable-next-line no-restricted-globals
						onClick: (event, rowData) => this.onClickDeleteUser(rowData.id)
					}
				]}
				options={{
					pageSize: 10
				}}
			/>
		)
	};

	render() {
		// console.log(this.props.match.params.deckId);
		// console.log();
		let table = this.table();
		return (
			<div className="user-management">
				{/* <h5>User management</h5>
				<hr /> */}
				{table}
			</div>

		);
	}
}

export default AdminUsers;
