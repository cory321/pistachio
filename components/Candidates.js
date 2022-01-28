import React, { useState } from 'react';

import Candidate from './Candidate';

function section( props ) {
	const { stage, candidates } = props;

	const candidateProps = { ...props };
	delete candidateProps.candidates;

	return [
		<tr key={ stage }>
			<td colSpan="5">
				<h2>
					{ stage } ({ candidates.length })
				</h2>
			</td>
		</tr>,
		columnHeaders( stage ),
		candidates.map( candidate => (
			<Candidate key={ candidate.id } candidate={ candidate } { ...candidateProps } />
		) ),
	];
}

// @todo - need to handle multiple applications (over time) better
function currentStage( candidate ) {
	let applications = candidate.applications.filter( application => ! application.prospect );
	if ( ! applications.length ) {
		return 'Prospect';
	}

	applications = applications.filter( application => 'rejected' !== application.status );
	if ( ! applications.length ) {
		return 'Rejected';
	}

	applications = applications.filter( application => 'hired' !== application.status );
	if ( ! applications.length ) {
		return 'Hired';
	}

	// @todo need to handle applicants in multiple applications (over jobs) better
	return applications.map( application => application.current_stage.name )[ 0 ] || 'Unknown';
}

function columnHeaders( stage ) {
	return (
		<tr key={ stage + 'ths' }>
			<th>Act?</th>
			<th>Jobs</th>
			<th>Name</th>
			<th>Ref</th>
			<th>Coordinator</th>
			<th>Last Activity</th>
			<th>Cover</th>
			<th>E-mail</th>
			<th>Pronouns</th>
			<th>Region</th>
			<th>Actions</th>
		</tr>
	);
}

export default function Candidates( props ) {
	const { isFetching } = props;
	const candidates =
		props.candidates && props.candidates.map( c => Object.assign( {}, c.json, { id: c.id } ) ); // Post Meta field

	// These HoverRow state variables are lifted here for use by all HoverRows
	const [ entry, setEntry ] = useState( 0 );
	const [ exit, setExit ] = useState( 0 );

	if ( ! candidates || ! candidates.length ) {
		return isFetching ? <p>Loading…</p> : <p>No matching candidates.</p>;
	}

	// @todo - need to order stages according to each job's stage list
	const stages = [
		'Application Review',
		'Pre-Interview Form',
		'Interview',
		'Code Test',
		'Trial',
		'Matt Chat',
		'Offer',
		'Hired',
		'Prospect',
		'Rejected',
	];

	const groupedByStage = candidates.reduce( ( groupedByStage, candidate ) => {
		const stage = currentStage( candidate );

		return {
			...groupedByStage,
			[ stage ]: [ ...( groupedByStage[ stage ] || [] ), candidate ],
		};
	}, {} );

	const activeCount = candidates.filter(
		candidate =>
			candidate.applications.filter( application => 'active' === application.status ).length
	).length;

	const groupedStages = Object.keys( groupedByStage ).sort( ( a, b ) => {
		return stages.indexOf( a ) - stages.indexOf( b );
	} );

	return [
		<p key={ 0 }>Active: { activeCount }</p>,
		<table key={ 1 } style={ { width: '100%', tableLayout: 'auto' } }>
			<tbody>
				{ groupedStages.map( stage =>
					section( {
						...props,
						stage,
						entry,
						setEntry,
						exit,
						setExit,
						candidates: groupedByStage[ stage ],
					} )
				) }
			</tbody>
		</table>,
	];
}
