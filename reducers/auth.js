import { LOG_IN, LOG_OUT } from '../actions/auth';

export default function auth( state = {}, action ) {
	switch ( action.type ) {
		case LOG_IN:
			return {
				...state,
				[ action.payload.service ]: action.payload.data,
			};
		case LOG_OUT: {
			const newState = { ...state };
			delete newState[ action.payload.service ];
			return newState;
		}
		case 'AUTH_CLEAR':
			return {};
	}

	return state;
}
