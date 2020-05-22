
import * as actionTypes from '../actions/actionTypes';
const initialState = {
	count: 0,
  user: 'Lam',
};

const reducerCounter = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.INCREASE:
			return {
				count: state.count + action.value,
				user: 'Lam',
			};
		case actionTypes.DECREASE:
			return {
				count: state.count - action.value,
				user: 'Lam',
			};
		default:
			return state;
	}
};

export default reducerCounter;
