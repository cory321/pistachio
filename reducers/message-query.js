import { SET } from '../actions/message-query';

const twoWeeksAgo = new Date( Date.now() - 1000 * 3600 * 24 * 14 ).toISOString().split( 'T' )[ 0 ];
const initialState = `after:${ twoWeeksAgo } -from:jobs@a8c.com -label:imported label:position-code-wrangler`;

export default function messageQuery( state = initialState, action ) {
	switch ( action.type ) {
		case SET:
			return action.payload;
	}

	return state;
}
