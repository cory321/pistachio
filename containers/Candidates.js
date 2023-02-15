import React from 'react';
import { filterCollectionWith } from '../lib/all-at';
import { merge } from 'lodash';

import Candidates from '../components/Candidates';

import '@wordpress/core-data';
import apiFetch from '@wordpress/api-fetch';
import { useSelect } from '@wordpress/data';
import { PISTACHIO } from '../data/constants';

const CandidateContainer = props => {
	const query = [ 'postType', 'candidate', { per_page: 300 } ];
	const candidates = useSelect( select => select( 'core' ).getEntityRecords( ...query ) ) || [];
	const filters = useSelect( select => select( PISTACHIO ).getFilters() );
	const isFetching = useSelect( select =>
		select( 'core/data' ).isResolving( 'core', 'getEntityRecords', query )
	);
	const filteredCandidates = filterCollectionWith( candidates, filters );
	const error = null;
	const currentUser = null;
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
			candidates={ filteredCandidates }
			error={ error }
			isFetching={ isFetching }
			currentUser={ currentUser }
			refresh={ props.fetchOne }
			uploadCoverLetter={ props.uploadCoverLetter }
			addPronouns={ addPronouns }
			filters={ filters }
		/>
	);
};

export default CandidateContainer;
