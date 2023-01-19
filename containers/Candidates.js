import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCandidatesAsync } from '../actions/candidates';
import { merge } from 'lodash';

import Candidates from '../components/Candidates';

import '@wordpress/core-data';
import apiFetch from '@wordpress/api-fetch';

const CandidateContainer = props => {
	const dispatch = useDispatch();
	const filters = useSelector( state => state.filters );
	const candidates = useSelector( state => state.candidates );
	const { isFetching, error } = useSelector( state => state.fetchers.candidates );

	useEffect( () => {
		dispatch( fetchCandidatesAsync() );
	}, [] );

	useEffect( () => {
		if ( candidates && filters !== props.filters ) {
			console.log( filters );
		}
	}, [ filters ] );

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
			currentUser={ props.currentUser }
			refresh={ props.fetchOne }
			uploadCoverLetter={ props.uploadCoverLetter }
			addPronouns={ addPronouns }
			filters={ props.filters }
		/>
	);
};

export default CandidateContainer;
