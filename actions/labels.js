export const ADD = 'LABELS_ADD'
export const ADD_MANY = 'LABELS_ADD_MANY'
export const FETCH = 'LABELS_FETCH'
export const SUCCESS = 'LABELS_SUCCESS'
export const ERROR = 'LABELS_ERROR'

export function add( label ) {
	return {
		type: ADD,
		payload: label,
	}
}

export function addMany( labels ) {
	return {
		type: ADD_MANY,
		payload: labels,
	}
}

export function success( fetchStart ) {
	return {
		type: SUCCESS,
		payload: fetchStart,
	}
}

export function error( err ) {
	return {
		type: ERROR,
		payload: err.toString()
	}
}
