import apiFetch from '@wordpress/api-fetch';
import { merge } from 'lodash';

export default {
	FETCH_FROM_API( action ) {
		return apiFetch( { path: action.path } );
	},
	UPDATE_PRONOUNS( { candidate, pronouns } ) {
		return apiFetch( {
			path: '/wp/v2/candidates/' + candidate.id,
			method: 'POST',
			data: {
				json: merge( {}, candidate, {
					keyed_custom_fields: {
						pronouns: {
							value: pronouns,
						},
					},
				} ),
			},
		} );
	},
};
