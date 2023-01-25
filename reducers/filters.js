import {
	CLEAR,
	JOBS,
	STATUS,
	MISSING_COVER_LETTER,
	MISSING_EMAIL_ADDRESS,
	MISSING_DEMOGRAPHICS,
	COORDINATOR,
} from '../actions/filters';

export const JOBS_PATH = 'json.applications.jobs.id';
export const STATUS_PATH = 'json.applications.status';
// The RegExp is weird because we're splitting on "."
// We also split on "|" for alternate paths, so | cannot be used in the RegExp.
export const MISSING_COVER_LETTER_PATH =
	'json.attachments.filename./Cover[\\s\\S]Letter[\\s\\S]Intro/|attachments.filename./^cover_letter\\Stxt$/';
export const MISSING_EMAIL_ADDRESS_PATH = 'json.email_addresses';
export const MISSING_DEMOGRAPHICS_PATH =
	'json.keyed_custom_fields.pronouns.value|json.keyed_custom_fields.region.value';
export const COORDINATOR_PATH = 'coordinator.id';

export default function filter( state = [], action ) {
	let path, newState;

	switch ( action.type ) {
		case JOBS:
			path = JOBS_PATH;
			newState = [ ...state.filter( filter => path !== filter.path ) ];
			if ( action.payload.length ) {
				return [
					...newState,
					{ type: 'candidate', path, values: action.payload, op: 'intersection' },
				];
			}
			return newState;
		case STATUS:
			path = STATUS_PATH;
			newState = [ ...state.filter( filter => path !== filter.path ) ];
			if ( action.payload.length ) {
				return [
					...newState,
					{ type: 'candidate', path, values: action.payload, op: 'intersection' },
				];
			}
			return newState;
		case MISSING_COVER_LETTER:
			path = MISSING_COVER_LETTER_PATH;
			newState = [ ...state.filter( filter => path !== filter.path ) ];
			if ( action.payload ) {
				return [ ...newState, { type: 'candidate', path, values: [], op: 'empty' } ];
			}
			return newState;
		case MISSING_EMAIL_ADDRESS:
			path = MISSING_EMAIL_ADDRESS_PATH;
			newState = [ ...state.filter( filter => path !== filter.path ) ];
			if ( action.payload ) {
				return [ ...newState, { type: 'candidate', path, values: [], op: 'empty' } ];
			}
			return newState;
		case MISSING_DEMOGRAPHICS:
			path = MISSING_DEMOGRAPHICS_PATH;
			newState = [ ...state.filter( filter => path !== filter.path ) ];
			if ( action.payload ) {
				return [ ...newState, { type: 'candidate', path, values: [ null ], op: 'intersection' } ];
			}
			return newState;
		case COORDINATOR: {
			path = COORDINATOR_PATH;
			newState = [ ...state.filter( filter => path !== filter.path ) ];
			if ( action.payload.length ) {
				let coordinatorOp = 'intersection';

				if ( 1 === action.payload[ 0 ] ) {
					coordinatorOp = 'any';
				} else if ( 0 === action.payload[ 0 ] ) {
					coordinatorOp = 'empty';
				}

				return [
					...newState,
					{
						type: 'candidate',
						path,
						values: action.payload,
						op: coordinatorOp,
					},
				];
			}
			return newState;
		}
		case CLEAR:
			return [];
	}

	return state;
}
