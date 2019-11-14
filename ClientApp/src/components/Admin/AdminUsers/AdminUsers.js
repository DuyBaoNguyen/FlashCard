import React, { Component } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import './AdminUsers.css';

var useStyles = makeStyles({
	root: {
		width: '100%',
		overflowX: 'auto'
	},
	table: {
		minWidth: 650
	}
});

function createData(username, name, email) {
	return { username, name, email };
}

var rows = [
	createData('username1', 'name1', 'email'),
	createData('username2', 'name1', 'email'),
	createData('username3', 'name1', 'email'),
	createData('username4', 'name1', 'email')
];

export default function AdminUsers() {
	const classes = useStyles();
	return (
		<Paper className={classes.root}>
			<Table className={classes.table} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>Username</TableCell>
						<TableCell align="right">Name</TableCell>
						<TableCell align="right">Email</TableCell>
						<TableCell align="right"></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map(row => (
						<TableRow key={row.name}>
							<TableCell component="th" scope="row">
								{row.username}
							</TableCell>
							<TableCell align="right">{row.name}</TableCell>
							<TableCell align="right">{row.email}</TableCell>
							<TableCell align="right"><a href="#">Delete</a></TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Paper>
	);
}
