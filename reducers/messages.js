import { findIndex } from 'lodash';
import addressparser from 'addressparser';

import { ADD, ADD_MANY, SET_MANY, SET_NAME, SET_META } from '../actions/messages';

function addOne( state, message ) {
	const index = findIndex( state, storedMessage => storedMessage.id === message.id );
	if ( ~index ) {
		// Preserves old Meta, but also adds/updates any new meta
		const oldMeta = 'meta' in state[ index ] ? state[ index ].meta : {};
		const newMeta = 'meta' in message ? message.meta : {};

		return [
			...state.slice( 0, index ),
			{ ...message, meta: { ...oldMeta, ...newMeta } },
			...state.slice( index + 1 ),
		];
	}
	return [ ...state, message ];
}

export default function messages( state = [], action ) {
	let oldMessage;

	switch ( action.type ) {
		case ADD:
			return addOne( state, action.payload );
		case ADD_MANY:
			return action.payload.reduce( addOne, state );
		case SET_MANY:
			const newState = action.payload.reduce( addOne, state );
			const newIds = action.payload.map( message => message.id );

			return newState.filter( message => newIds.includes( message.id ) );
		case SET_NAME:
			oldMessage = state.find( message => message.id === action.payload.id );
			if ( ! oldMessage ) {
				break;
			}

			const fromIndex = findIndex( oldMessage.payload.headers, header => 'From' === header.name );

			const oldFrom = addressparser( oldMessage.payload.headers[ fromIndex ].value ).shift();
			// \ -> \\, " -> \" for quotet-text
			const newFrom = `"${ action.payload.name.replace( '\\', '\\\\' ).replace( '"', '\\"' ) }" <${
				oldFrom.address
			}>`;

			const newMessage = {
				...oldMessage,
				payload: {
					...oldMessage.payload,
					headers: [
						...oldMessage.payload.headers.slice( 0, fromIndex ),
						{ name: 'From', value: newFrom },
						...oldMessage.payload.headers.slice( fromIndex + 1 ),
					],
				},
			};

			return addOne( state, newMessage );
		case SET_META:
			oldMessage = state.find( message => message.id === action.payload.id );
			if ( ! oldMessage ) {
				break;
			}

			// We naïvely overwrite here, but (by design) `addOne()` will preserve
			// old keys as well
			return addOne( state, { ...oldMessage, meta: action.payload.meta } );
	}

	return state;
}
