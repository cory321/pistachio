import findIndex from 'lodash.findindex'

import { ADD, ADD_MANY, REMOVE, TOGGLE_NEEDS_ACTION } from '../actions/candidates'

export default function candidates( state = [], action ) {
	switch ( action.type ) {
	case ADD :
		const index = findIndex( state, candidate => candidate.id === action.payload.id )
		if ( ~ index ) {
			return [
				...state.slice( 0, index ),
				// we need to merge in case we added some fields (like needsAction) outside of the API
				{ ...state[index], ...action.payload },
				...state.slice( index + 1 ),
			]
		} 
			return [ ...state, action.payload ]
		
	case ADD_MANY :
		return [ ...state, ...action.payload ]
	case REMOVE :
		const removeIndex = findIndex( state, candidate => candidate.id === action.payload )
		if ( ~ removeIndex ) {
			return [
				...state.slice( 0, removeIndex ),
				...state.slice( removeIndex + 1 ),
			]
		} 
			return state
		
	case TOGGLE_NEEDS_ACTION :
		const toggleIndex = findIndex( state, candidate => candidate.id === action.payload )
		if ( ~ toggleIndex ) {
			return [
				...state.slice( 0, toggleIndex ),
				{ ...state[toggleIndex], needsAction: ! state[toggleIndex].needsAction },
				...state.slice( toggleIndex + 1 ),
			]
		} 
			return state
		
	}
	return state
}
