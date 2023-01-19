import { findIndex } from 'lodash';

import { ADD, ADD_MANY, REPLACE_ALL, REMOVE } from '../actions/candidates';

export default function candidates( state = [], action ) {
	switch ( action.type ) {
		case ADD: {
			const index = findIndex( state, candidate => candidate.id === action.payload.id );
			if ( ~index ) {
				return [
					...state.slice( 0, index ),
					// we need to merge in case we added some fields outside of the API
					{ ...state[ index ], ...action.payload },
					...state.slice( index + 1 ),
				];
			}
			return [ ...state, action.payload ];
		}
		case ADD_MANY:
			return [ ...state, ...action.payload ];

		case REPLACE_ALL:
			return action.payload;

		case REMOVE: {
			const removeIndex = findIndex( state, candidate => candidate.id === action.payload );
			if ( ~removeIndex ) {
				return [ ...state.slice( 0, removeIndex ), ...state.slice( removeIndex + 1 ) ];
			}
			return state;
		}
	}
	return state;
}
