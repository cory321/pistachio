import React from 'react';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { PISTACHIO } from '../data/constants';
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

const mapStateToProps = withSelect( select => {
	const store = select( PISTACHIO );
	const { getEntityRecords } = select( 'core' );
	const { hasFinishedResolution } = select( 'core/data' );
	const query = [ 'postType', 'candidate', { per_page: 300 } ];
	const candidates = getEntityRecords( ...query );
	const hasFinishedLoading = hasFinishedResolution( 'core', 'getEntityRecords', query );
	const greenhouseID = ( store.getGreenhouseAuth() && store.getGreenhouseAuth().id ) || 0;
	const jobIdFilter = store.getFilters().filter( filter => JOBS_PATH === filter.path );
	let filteredJobIds = [];
	let candidatesOnJobIds = candidates;

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
	if ( hasFinishedLoading ) {
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
		filters: store.getFilters().filter( filter => 'candidate' === filter.type ),
		coordinators,
		currentUser: store.getUsers().filter( user => user.id == greenhouseID )[ 0 ], // eslint-disable-line eqeqeq
	};
} );

const mapDispatchToProps = withDispatch( dispatch => {
	const actions = dispatch( PISTACHIO );
	return {
		status: status => actions.statusFilters( status ),
		coordinator: coordinator => actions.coordinatorFilters( coordinator ),
		missingCoverLetter: isActive => actions.missingCoverLetterFilters( isActive ),
		missingEmailAddress: isActive => actions.missingEmailAddressFilters( isActive ),
		missingDemographics: isActive => actions.missingDemographicsFilters( isActive ),
	};
} );

export default compose( mapStateToProps, mapDispatchToProps )( FiltersContainer );
