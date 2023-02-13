import React from 'react';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { PISTACHIO_STORE } from '../data/constants';
import allAt from '../lib/all-at';

import { JOBS_PATH } from '../reducers/filters';

import Filters from '../components/Filters';

function FiltersContainer( {
	filters,
	coordinators,
	currentUser,
	status,
	coordinator,
	missingCoverLetter,
	missingEmailAddress,
	missingDemographics,
} ) {
	return (
		<Filters
			filters={ filters }
			coordinators={ coordinators }
			currentUser={ currentUser }
			status={ status }
			coordinator={ coordinator }
			missingCoverLetter={ missingCoverLetter }
			missingEmailAddress={ missingEmailAddress }
			missingDemographics={ missingDemographics }
		/>
	);
}
export default compose(
	withSelect( select => {
		const greenhouseID =
			select( PISTACHIO_STORE ).getGreenhouseAuth() &&
			select( PISTACHIO_STORE ).getGreenhouseAuth().id;
		const jobIdFilter = select( PISTACHIO_STORE )
			.getFilters()
			.filter( filter => JOBS_PATH === filter.path );
		let filteredJobIds = [];
		let candidatesOnJobIds = select( PISTACHIO_STORE ).getCandidates();

		if ( jobIdFilter.length ) {
			filteredJobIds = jobIdFilter[ 0 ].values;
			candidatesOnJobIds = candidatesOnJobIds.filter( candidate =>
				allAt( candidate, 'json.applications.jobs.id' ).some( jobId =>
					filteredJobIds.includes( jobId )
				)
			);
		}

		// we need to go through a Map, so that we have only unique coordinators
		let coordinators = [];
		if ( candidatesOnJobIds.length > 0 ) {
			coordinators = Array.from(
				new Map(
					candidatesOnJobIds
						.filter( candidate => candidate.json.coordinator )
						.map( candidate => [ candidate.json.coordinator.id, candidate.json.coordinator.name ] )
				)
					// the leading space is needed to make sure this coordinator is at the top of a sorted list
					.set( 0, ' ∅ None' )
					.set( 1, ' 👤 Somebody' ),
				pair => ( { id: pair[ 0 ], name: pair[ 1 ] } )
			).sort( ( a, b ) => a.name.localeCompare( b.name ) );
		}

		return {
			// This container (and its component) should be named CandidateFilters
			filters: select( PISTACHIO_STORE )
				.getFilters()
				.filter( filter => 'candidate' === filter.type ),
			coordinators,
			currentUser: select( PISTACHIO_STORE )
				.getUsers()
				.filter( user => user.id == greenhouseID )[ 0 ], // eslint-disable-line eqeqeq
		};
	} ),

	withDispatch( dispatch => {
		return {
			status: status => dispatch( PISTACHIO_STORE ).statusFilters( status ),
			coordinator: coordinator => dispatch( PISTACHIO_STORE ).coordinatorFilters( coordinator ),
			missingCoverLetter: isActive =>
				dispatch( PISTACHIO_STORE ).missingCoverLetterFilters( isActive ),
			missingEmailAddress: isActive =>
				dispatch( PISTACHIO_STORE ).missingEmailAddressFilters( isActive ),
			missingDemographics: isActive =>
				dispatch( PISTACHIO_STORE ).missingDemographicsFilters( isActive ),
		};
	} )
)( FiltersContainer );
