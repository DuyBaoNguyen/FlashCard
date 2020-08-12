import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import * as actions from '../../../store/actions';
import withErrorHandler from '../../../hoc/withErrorHandler';
import { Themes } from '../../../applicationConstants';
import Input from '../../Shared/Input/Input';
import * as utils from '../../../util/util';
import './DeckForm.css';

const initialForm = {
	name: {
		value: '',
		valid: true,
		validation: {
			required: true
		},
		touched: false,
		error: null
	},
	description: {
		value: '',
		valid: true,
		validation: {},
		touched: false,
		error: null
	},
	theme: {
		value: '',
		valid: true,
		validation: {},
		touched: false,
		error: null
	},
	valid: true
};

class DeckForm extends Component {
	state = {
		form: initialForm
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.deck && prevState.form.name.value === '') {
			return {
				...prevState,
				form: {
					...prevState.form,
					name: {
						...prevState.form.name,
						value: prevState.form.name.value || nextProps.deck.name
					},
					description: {
						...prevState.form.description,
						value: prevState.form.description.value || nextProps.deck.description
					},
					theme: {
						...prevState.form.theme,
						value: prevState.form.theme.value || nextProps.deck.theme
					}
				}
			}
		}
		if (nextProps.error) {
			nextProps.onClearUpdateDeckError();
			return {
				...prevState,
				form: {
					...prevState.form,
					name: {
						...prevState.form.name,
						valid: nextProps.error.Name ? false : true,
						error: nextProps.error.Name ? nextProps.error.Name[0] : null,
						touched: true
					},
					description: {
						...prevState.form.description,
						valid: nextProps.error.Description ? false : true,
						error: nextProps.error.Description ? nextProps.error.Description[0] : null,
						touched: true
					},
					theme: {
						...prevState.form.theme,
						valid: nextProps.error.Theme ? false : true,
						error: nextProps.error.Theme ? nextProps.error.Theme[0] : null,
						touched: true
					},
					valid: false
				}
			};
		}
		return null;
	}

	handleInputChange = (event) => {
		const form = this.state.form;
		const updatedForm = { ...form };
		const updatedField = { ...form[event.target.name] };

		updatedField.value = event.target.value;
		updatedField.touched = true;
		const result = utils.checkValidity(updatedField.value, updatedField.validation);
		updatedField.valid = result.valid;
		updatedField.error = result.message;

		updatedForm[event.target.name] = updatedField;

		let formIsValid = true;
		for (let item in updatedForm) {
			if (item !== 'valid') {
				formIsValid = formIsValid && updatedForm[item].valid;
			}
		}
		updatedForm.valid = formIsValid;

		this.setState({ form: updatedForm });
	}

	handleSubmit = (event) => {
		const { deck, onCreateDeck, onEditDeck } = this.props;
		const { form } = this.state;

		event.preventDefault();
		if (form.valid) {
			const newDeck = {
				name: form.name.value,
				description: form.description.value,
				theme: form.theme.value
			};
			if (deck) {
				onEditDeck(deck.id, newDeck);
			} else {
				onCreateDeck(newDeck);
			}
		}
	}

	render() {
		const { deck } = this.props;
		const { form } = this.state;

		const radios = Themes.map((theme, index) => (
			<label key={index} className="circle">
				<input
					type="radio"
					name="theme"
					value={theme}
					checked={form.theme.value === theme}
					onChange={this.handleInputChange} />
				<div className="button-circle">
					<span style={{ background: theme }}></span>
				</div>
			</label>
		));

		return (
			<div className="deck-form">
				<div className="deck-form-wrapper">
					<div className="deck-form-header">
						<p>{deck ? 'Edit deck' : 'Create deck'}</p>
					</div>
					<form onSubmit={this.handleSubmit}>
						<div className="deck-form-input">
							<label>Deck name</label>
							<Input
								name="name"
								defaultValue={deck?.name}
								autoComplete="off"
								autoFocus
								touched={form.name.touched}
								valid={form.name.valid}
								onChange={this.handleInputChange} />
							{!form.name.valid && (
								<div className="error-notification">
									{form.name.error}
								</div>
							)}
							<label>Description</label>
							<Input
								name="description"
								defaultValue={deck?.description}
								autoComplete="off"
								touched={form.description.touched}
								valid={form.description.valid}
								onChange={this.handleInputChange} />
							{!form.description.valid && (
								<div className="error-notification">
									{form.description.error}
								</div>
							)}
						</div>
						<div className="deck-form-circle">
							{radios}
						</div>
						{!form.theme.valid && (
							<div className="error-notification theme-error">
								{form.theme.error}
							</div>
						)}
						<div className="deck-form-button">
							<Link to={this.props.location.state?.backUrl || '/'}>
								<button
									type="button"
									className="deck-form-button-cancel">
									Cancel
								</button>
							</Link>
							<button
								className="deck-form-button-create"
								type="submit">
								{deck ? 'Update' : 'Create'}
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		error: state.deck.createDeckError || state.deck.editDeckError
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		onCreateDeck: (deck) => dispatch(actions.createDeck(deck)),
		onEditDeck: (id, deck) => dispatch(actions.editDeck(id, deck)),
		onClearUpdateDeckError: () => dispatch(actions.clearUpdateDeckError())
	};
};

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(DeckForm)));
