import React from 'react';
import { useSelector } from 'react-redux';
import { filterCollectionWith } from '../lib/all-at';
import { merge } from 'lodash';

import Candidates from '../components/Candidates';

import '@wordpress/core-data';
import apiFetch from '@wordpress/api-fetch';
import { useSelect } from '@wordpress/data';

const CandidateContainer = props => {
	const filters = useSelector( state => state.filters );
	const candidates = useSelect( select => select( 'pistachio/data' ).getCandidates() );
	const filteredCandidates = filterCollectionWith( candidates, filters );
	const { isFetching, error } = useSelector( state => state.fetchers.candidates );
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
