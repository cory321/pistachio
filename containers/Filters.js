import React from 'react';
import { connect } from 'react-redux';

import allAt from '../lib/all-at';

import { filters } from '../actions';

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

function mapStateToProps( state ) {
	const greenhouseID = ( state.auth.greenhouse && state.auth.greenhouse.id ) || 0;

	const jobIdFilter = state.filters.filter( filter => JOBS_PATH === filter.path );
	let filteredJobIds = [];
	let candidatesOnJobIds = state.candidates;

	if ( jobIdFilter.length ) {
		filteredJobIds = jobIdFilter[ 0 ].values;
		candidatesOnJobIds = candidatesOnJobIds.filter( candidate =>
			allAt( candidate, 'json.applications.jobs.id' ).some( jobId =>
				filteredJobIds.includes( jobId )
			)
		);
	}

	// we need to go through a Map, so that we have only unique coordinatos
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
		filters: state.filters.filter( filter => 'candidate' === filter.type ),
		coordinators,
		currentUser: state.users.filter( user => user.id == greenhouseID )[ 0 ], // eslint-disable-line eqeqeq
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		status: status => dispatch( filters.status( status ) ),
		coordinator: coordinator => dispatch( filters.coordinator( coordinator ) ),
		missingCoverLetter: isActive => dispatch( filters.missingCoverLetter( isActive ) ),
		missingEmailAddress: isActive => dispatch( filters.missingEmailAddress( isActive ) ),
		missingDemographics: isActive => dispatch( filters.missingDemographics( isActive ) ),
	};
}

export default connect( mapStateToProps, mapDispatchToProps )( FiltersContainer );
