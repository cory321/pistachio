import React from 'react';
import { useSelector } from 'react-redux';
import { filterCollectionWith } from '../lib/all-at';

import Candidates from '../components/Candidates';

import '@wordpress/core-data';
import { PISTACHIO_STORE_NAME } from '../data/constants';
import { useSelect, useDispatch, useRegistry, select } from '@wordpress/data';

const CandidateContainer = props => {
	const filters = useSelector( state => state.filters );
	const candidates = useSelect( select => select( PISTACHIO_STORE_NAME ).getCandidates() );
	const filteredCandidates = filterCollectionWith( candidates, filters );
	const { isFetching, error } = useSelect( select =>
		select( PISTACHIO_STORE_NAME ).getCandidateFetchers()
	);
	const currentUser = null;

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
