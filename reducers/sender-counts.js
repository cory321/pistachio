import { SET } from '../actions/sender-counts'

export default function senderCounts( state = {}, action ) {
	switch ( action.type ) {
	case SET :
		return action.payload
	}

	return state
}
