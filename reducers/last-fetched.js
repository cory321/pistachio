import { combineReducers } from 'redux'

import { jobs, candidates, users, labels } from '../actions'

function lastFetcheder( SUCCESS ) {
	return function lastFetched( state = '0000-00-00T00:00:00.000Z', action ) {
		switch ( action.type ) {
		case SUCCESS :
			return action.payload
		}

		return state
	}
}

export default combineReducers( {
	jobs: lastFetcheder( jobs.SUCCESS ),
	candidates: lastFetcheder( candidates.SUCCESS ),
	users: lastFetcheder( users.SUCCESS ),
	labels: lastFetcheder( labels.SUCCESS ),
} )
