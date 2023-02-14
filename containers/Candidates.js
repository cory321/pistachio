import React from 'react';
import { filterCollectionWith } from '../lib/all-at';

import Candidates from '../components/Candidates';

import '@wordpress/core-data';
import { PISTACHIO } from '../data/constants';
import { useSelect } from '@wordpress/data';

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
