import React, { Component } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import './CardManagement.css';
import Navbar from '../../modules/NavBar/Navbar';
import Info from '../../modules/Info/Info';
import DeckList from '../../modules/DeckList/DeckList';

const columns = [
	{ id: 'front', label: 'Front', minWidth: 170 },
	{ id: 'back', label: 'Back', minWidth: 100 },
	{
		id: 'population',
		label: 'Population',
		minWidth: 170,
		align: 'right',
		format: value => value.toLocaleString()
	}
];

function createData(front, back, population) {
	return { front, back, population };
}

const rows = [
	createData('India', 'IN', 1324171354),
	createData('China', 'CN', 1403500365)
];

const useStyles = makeStyles({
	root: {
		width: '100%'
	},
	tableWrapper: {
		maxHeight: 440,
		overflow: 'auto'
	}
});

export default function CardManagement() {
	const classes = useStyles();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = event => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	return (
		<div>
			<Navbar navTitle="Card Management" />
			<div className="field">
				<Paper className={classes.root}>
					<div className={classes.tableWrapper}>
						<Table stickyHeader aria-label="sticky table">
							<TableHead>
								<TableRow>
									{columns.map(column => (
										<TableCell
											key={column.id}
											align={column.align}
											style={{ minWidth: column.minWidth }}
										>
											{column.label}
										</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{rows
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map(row => {
										return (
											<TableRow
												hover
												role="checkbox"
												tabIndex={-1}
												key={row.code}
											>
												{columns.map(column => {
													const value = row[column.id];
													return (
														<TableCell key={column.id} align={column.align}>
															{column.format && typeof value === 'number'
																? column.format(value)
																: value}
														</TableCell>
													);
												})}
											</TableRow>
										);
									})}
							</TableBody>
						</Table>
					</div>
					<TablePagination
						rowsPerPageOptions={[10, 25, 100]}
						component="div"
						count={rows.length}
						rowsPerPage={rowsPerPage}
						page={page}
						backIconButtonProps={{
							'aria-label': 'previous page'
						}}
						nextIconButtonProps={{
							'aria-label': 'next page'
						}}
						onChangePage={handleChangePage}
						onChangeRowsPerPage={handleChangeRowsPerPage}
					/>
				</Paper>
			</div>
		</div>
	);
}
