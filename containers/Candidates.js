import React from 'react';
import { useSelector } from 'react-redux';
import { filterCollectionWith } from '../lib/all-at';

import Candidates from '../components/Candidates';

import '@wordpress/core-data';
import { PISTACHIO_STORE } from '../data/constants';
import { useSelect, useRegistry } from '@wordpress/data';

const CandidateContainer = props => {
	const filters = useSelect( select => select( PISTACHIO_STORE ).getFilters() );
	const candidates = useSelect( select => select( PISTACHIO_STORE ).getCandidates() );
	const filteredCandidates = filterCollectionWith( candidates, filters );
	const { isFetching, error } = useSelect( select =>
		select( PISTACHIO_STORE ).candidatesAreFetching()
	);
	const currentUser = null;

	console.log( useRegistry() );

	return (
		<Candidates
			candidates={ filteredCandidates }
			error={ error }
			isFetching={ isFetching }
			currentUser={ currentUser }
			refresh={ props.fetchOne }
			uploadCoverLetter={ props.uploadCoverLetter }
			filters={ filters }
		/>
	);
};

export default CandidateContainer;
