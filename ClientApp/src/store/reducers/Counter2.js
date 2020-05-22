const initialState = {
	count: 0,
	user: 'Lam',
};

const reducerCounter2 = (state = initialState, action) => {
	switch (action.type) {
		case 'INCREASE2':
			return {
				count: state.count + 1,
				user: 'Lam',
			};
		case 'DECREASE2':
			return {
				count: state.count - 1,
				user: 'Lam',
			};
		default:
			return state;
	}
};

export default reducerCounter2;
