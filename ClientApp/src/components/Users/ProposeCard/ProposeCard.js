/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import authService from '../../api-authorization/AuthorizeService';
import MaterialTable from 'material-table';
import Select from 'react-select';
import Button from '@material-ui/core/Button';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import './ProposeCard.css';

var array = [];
class ProposeCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			cardSource : [],
			cardData: [],
			redirectAddCards: false,
			selectedOption: null,
			file: null,
			base64: null,
			type: [
				{ value: 'noun', label: 'Noun' },
				{ value: 'verb', label: 'Verb' },
				{ value: 'adjective', label: 'Adjective' },
				{ value: 'adverb', label: 'Adverb' },
				{ value: 'preposition', label: 'Preposition' }
			]
		};
	}

	// componentWillMount() {

	// }

	componentDidMount() {
		// this.getCard();
		// this.updateCard(this.props.match.params.front);
	}

	handleImageChange = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (e) => {
			let image = document.getElementById('newImage');
			image.src = e.target.result;
			image.style.width = '100px';
			image.style.height = '100px';
			document.getElementById('deleteImage').style.display = 'flex';
      this.setState({
        file: file,
        base64: reader.result
      });
			// this.handleSubmit()
			console.log(this.state.base64);
    };
  }

	// deleteBack = async param => {
	// 	var url = '/api/decks/' + this.state.id + '/cards';
	// 	const token = await authService.getAccessToken();
	// 	const data = '[' + param.toString() + ']';
	// 	// eslint-disable-next-line no-restricted-globals
	// 	var r = confirm('Are you sure to delete this card?');
	// 	if (r == true) {
	// 		try {
	// 			const response = await fetch(url, {
	// 				method: 'DELETE',
	// 				body: data, // data can be `string` or {object}!
	// 				headers: {
	// 					Authorization: `Bearer ${token}`,
	// 					'Content-Type': 'application/json'
	// 				}
	// 			});
	// 			const json = await response;
	// 			console.log('Success:', JSON.stringify(json));
	// 		} catch (error) {
	// 			console.error('Error:', error);
	// 		}
	// 		// eslint-disable-next-line no-undef
	// 		// eslint-disable-next-line no-restricted-globals
	// 		location.reload();
	// 	}
	// };

	// updateCard = async front => {
	// 	var url = '/api/proposedcards';
	// 	const token = await authService.getAccessToken();
	// 	const response = await fetch(url, {
	// 		headers: !token ? {} : { Authorization: `Bearer ${token}` }
	// 	});

	// 	this.setState({ cardData: data, loading: false });
	// 	console.log(this.state.cardData);
	// 	// console.log(this.state.categories);
	// 	console.log(url);
	// };

	addCard = async param => {
		var url = '/api/proposedcards';
		const token = await authService.getAccessToken();
		const data = {
			front: document.getElementById('front').value,
			back: {
				type: this.state.selectedOption.value,
				meaning: document.getElementById('meaning').value,
				example: document.getElementById('example').value,
				image: this.state.base64
			}
		};
		// console.log(JSON.stringify(data));
		try {
			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(data), // data can be `string` or {object}!
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});
			const json = await response;
			console.log('Success:', JSON.stringify(json));
			array.push(data.back);
			this.setState({
				cardData: array,
				selectedOption: null,
				base64: null
			});
			// console.log(this.state.cardData);
			// this.updateCard(document.getElementById('front').value);
			document.getElementById('meaning').value = '';
			document.getElementById('example').value = '';
			document.getElementById('image').value = '';
			let image = document.getElementById('newImage');
			image.src = '';
			image.style.width = '0';
			image.style.height = '0';
			document.getElementById('deleteImage').style.display = 'none';
		} catch (error) {
			console.error('Error:', error);
		}
	};

	handleChange = selectedOption => {
		this.setState({ selectedOption }, () =>
			console.log(`Option selected:`, this.state.selectedOption)
		);
	};

	onChange = param => {
		console.log(param);
	};

	onClickPropose = async () => {
		Swal.fire({
			title: 'Are you sure to propse this card?',
			showCancelButton: true,
			cancelButtonColor: '#b3b3b3',
			confirmButtonColor: '#007bff',
			confirmButtonText: 'Yes'
		}).then(result => {
			if (result.value) {
				this.addCard();
			}
		});
	};

	deleteImage = (e) => {
		e.preventDefault();
		let image = document.getElementById('newImage');
		image.src = '';
		image.style.width = '0';
		image.style.height = '0';
		document.getElementById('deleteImage').style.display = 'none';
		document.getElementById('image').value = '';
		this.setState({ base64: null });
	}

	render() {
		let front;
		if (this.state.cardData.backs !== undefined) {
			console.log(this.state.cardData);
			front = this.state.cardData.front;
			var backSide = this.state.cardData.backs.map(back => {
				return (
					<div
						className="content-back-side"
						onClick={() => this.deleteBack(back.id)}
					>
					<div className="info">
							<p className="meaning">{back.meaning}</p>
							<p className="type">{back.type}</p>
							<p className="example">{back.example}</p>
						</div>
						<img
							src={back.image}
							className={classnames(
								'image',
								back.image === null ? 'none-display' : ''
							)}
						/>
					</div>
				);
			});
		}
		const { selectedOption } = this.state;
		return (
			<div>
				<div className="deck-back">
					<Link to={this.props.location.state && this.props.location.state.returnUrl || '/'}>Back</Link>
				</div>
				<div className="create-cards">
					{/* <a href="#">Done</a> */}
					<div className="create-cards-info">
						<label for="fname">Front</label>
						<input
							type="text"
							id="front"
							name="dname"
							defaultValue={this.state.cardSource !== undefined ? this.state.cardSource.front : ""}
						/>
						<hr />
						<label for="fname">Category</label>
						<Select
							className="select"
							id="categories"
							value={selectedOption}
							onChange={this.handleChange}
							options={this.state.type}
						/>
						<br />
						<label for="fname">Meaning</label>
						<input type="text" id="meaning" name="dname" />
						<br /><br />
						<label for="fname">Example</label>
						<input type="text" id="example" name="dname" />
						<br /><br />
						Image
						<div className="image-container">
							<label>
								<div className="image-input">
									<i class="far fa-image" style={{ fontSize: 50 }}></i>
									<img id="newImage" />
									<span id="deleteImage" onClick={(event) => this.deleteImage(event)}>
										<i class="fas fa-times" style={{ fontSize: 12 }}></i>
									</span>
								</div>
								<input type="file" id="image" accept='image/*' onChange={this.handleImageChange} />
							</label>
						</div>
						<hr />
						<Button
							className="button-submit"
							onClick={this.onClickPropose}
							type="button"
							color="primary"
						>
							<p>Propose</p>
						</Button>
					</div>
					<hr />
					<div className="create-cards-backside">{backSide}</div>
				</div>
			</div>
		);
	}
}

export default ProposeCard;
