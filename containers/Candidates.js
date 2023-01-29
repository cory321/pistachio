import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { merge } from 'lodash';

import Candidates from '../components/Candidates';

import '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

const CandidateContainer = props => {
	const filters = useSelector( state => state.filters );
	const { candidates, error, isFetching, currentUser } = useSelect( select => ( {
		candidates: select( 'core' ).getEntityRecords( 'postType', 'candidate', { per_page: 300 } ),
		error: null,
		isFetching: false,
		currentUser: null,
	} ) );

	console.log( filters );

	const addPronouns = ( candidate, pronouns ) => {
		apiFetch( {
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
	};

	return (
		<Candidates
			candidates={ candidates }
			error={ error }
			isFetching={ isFetching }
			currentUser={ currentUser }
			refresh={ props.fetchOne }
			uploadCoverLetter={ props.uploadCoverLetter }
			addPronouns={ addPronouns }
			filters={ props.filters }
		/>
	);
};

export default CandidateContainer;
