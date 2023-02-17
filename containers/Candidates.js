import React from 'react';
import { filterCollectionWith } from '../lib/all-at';
import { merge } from 'lodash';

import Candidates from '../components/Candidates';

import '@wordpress/core-data';
import { useSelect, useDispatch } from '@wordpress/data';
import { PISTACHIO } from '../data/constants';

const CandidateContainer = props => {
	const { saveEntityRecord } = useDispatch( 'core' );
	const { errorCandidates } = useDispatch( PISTACHIO );
	const query = [ 'postType', 'candidate', { per_page: 300 } ];
	const candidates = useSelect( select => select( 'core' ).getEntityRecords( ...query ) ) || [];
	const filters = useSelect( select => select( PISTACHIO ).getFilters() );
	const isFetching = useSelect( select =>
		select( 'core/data' ).isResolving( 'core', 'getEntityRecords', query )
	);
	const filteredCandidates = filterCollectionWith( candidates, filters );
	const error = null;
	const currentUser = null;

	const updatePronouns = ( candidate, pronouns ) => {
		const updatedCandidate = {
			id: candidate.id,
			json: merge( {}, candidate, {
				keyed_custom_fields: {
					pronouns: {
						value: pronouns,
					},
				},
			} ),
		};
		saveEntityRecord( 'postType', 'candidate', updatedCandidate, {
			throwOnError: true,
		} ).catch( error => {
			errorCandidates( error.message );
		} );
	};

	const updateRegion = ( candidate, region ) => {
		const updatedCandidate = {
			id: candidate.id,
			json: merge( {}, candidate, {
				keyed_custom_fields: {
					region: {
						value: region,
					},
				},
			} ),
		};
		saveEntityRecord( 'postType', 'candidate', updatedCandidate, {
			throwOnError: true,
		} ).catch( error => {
			errorCandidates( error.message );
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
			updatePronouns={ updatePronouns }
			updateRegion={ updateRegion }
			filters={ filters }
		/>
	);
};

export default CandidateContainer;
