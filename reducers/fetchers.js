import { combineReducers } from 'redux'

import { jobs, candidates, users, messages, labels } from '../actions'

function fetcher( FETCH, SUCCESS, ERROR ) {
	function isFetching( state = false, action ) {
		switch ( action.type ) {
		case FETCH :
			return true
		case SUCCESS :
			return false
		case ERROR :
			return false
		}

		return state
	}

	function error( state = '', action ) {
		switch ( action.type ) {
		case FETCH :
			return ''
		case SUCCESS :
			return ''
		case ERROR :
			return action.payload
		}

		return state
	}

	return combineReducers( {
		isFetching,
		error
	} )
}

export default combineReducers( {
	jobs: fetcher( jobs.FETCH, jobs.SUCCESS, jobs.ERROR ),
	candidates: fetcher( candidates.FETCH, candidates.SUCCESS, candidates.ERROR ),
	users: fetcher( users.FETCH, users.SUCCESS, users.ERROR ),
	messages: fetcher( messages.FETCH, messages.SUCCESS, messages.ERROR ),
	labels: fetcher( labels.FETCH, labels.SUCCESS, labels.ERROR ),
} )
