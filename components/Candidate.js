import React, { Component } from 'react';
import moment from 'moment';

import allAt from '../lib/all-at';
import { MISSING_COVER_LETTER_PATH } from '../reducers/filters';
import A8cBadge from './A8cBadge';

const coverLetterRegexps = MISSING_COVER_LETTER_PATH.split( '|' ).map(
	path => new RegExp( path.split( '/' ).slice( -2, -1 ) )
);

function coverLetter( candidate ) {
	return candidate.attachments
		.map( attachment => attachment.filename )
		.some( filename => coverLetterRegexps.some( regexp => regexp.test( filename ) ) );
}

function interviewTranscript( candidate ) {
	return candidate.attachments
		.map( attachment => attachment.filename )
		.some( filename => /Interview Transcript/.test( filename ) );
}

function Unimportant( props ) {
	return (
		<span style={ { color: '#ccc' } } { ...props }>
			{ props.children }
		</span>
	);
}

function add( candidate ) {
	return <a href={ `https://app.greenhouse.io/people/${ candidate.id }#candidate_details` }>Add</a>;
}

export default class Candidate extends Component {
	constructor( props ) {
		super( props );

		for ( const func of [
			'toggleNeedsAction',
			'uploadCoverLetter',
			'uploadTranscript',
			'addPronouns',
		] ) {
			this[ func ] = this[ func ].bind( this );
		}

		this.state = {
			coverLetter: coverLetter( props.candidate ),
			interviewTranscript: interviewTranscript( props.candidate ),
		};
	}

	componentWillReceiveProps( nextProps ) {
		this.setState( {
			coverLetter: coverLetter( nextProps.candidate ),
			interviewTranscript: interviewTranscript( nextProps.candidate ),
		} );
	}

	toggleNeedsAction() {
		this.props.toggleNeedsAction( this.props.candidate.id );
	}

	uploadCoverLetter( event ) {
		event.preventDefault();

		this.props.uploadCoverLetter( this.props.candidate );
	}

	addPronouns( event ) {
		event.preventDefault();
		const pronouns = window.prompt( 'Pronouns?', '' ); // obviously we want to show a dropdown here :)
		this.props.addPronouns( this.props.candidate, pronouns );
	}

	uploadTranscript( event ) {
		event.preventDefault();
		this.props.uploadTranscript( this.props.candidate );
	}

	jobAcronym( jobName ) {
		const special = {
			'VIP Developer': 'VIP',
		};
		return special[ jobName ] || jobName.replace( /[a-z ]/g, '' ).substr( 0, 2 );
	}

	render() {
		const { candidate, currentUser, isFetching } = this.props;
		const referredApplications = candidate.applications.filter(
			a => a.source && a.source.id === 13
		);
		const uploadCoverLetter = this.state.coverLetter ? null : (
			<button onClick={ this.uploadCoverLetter } disabled={ isFetching }>
				Upload
			</button>
		);
		const isMine =
			currentUser && candidate.coordinator && currentUser.id === candidate.coordinator.id;
		const activeApplications = candidate.applications.filter(
			application => 'active' === application.status
		).length;
		// we need the || false, because the value can be undefined and then React thinks the component is uncontrolled
		const needsAction = (
			<label>
				<input
					type="checkbox"
					checked={ candidate.needsAction || false }
					onChange={ this.toggleNeedsAction }
				/>
			</label>
		);
		const jobs = allAt( candidate, 'applications.jobs.name' )
			.map( name => this.jobAcronym( name ) )
			.join( ', ' );
		let name = [ candidate.first_name, candidate.last_name ].join( ' ' );
		if ( name.length < 2 ) {
			name = candidate.email_addresses.map( address => address.value ).join( ', ' ) || candidate.id;
		}
		const nameLink = [
			<a key={ 0 } href={ 'https://app.greenhouse.io/people/' + candidate.id }>
				{ name }
			</a>,
			activeApplications > 1 ? ` \u274C ${ activeApplications } apps` : '',
		];
		const a8cBadge = A8cBadge( {
			emails: candidate.email_addresses.map( email_address => email_address.value ),
		} );
		const referral = a8cBadge ? (
			a8cBadge
		) : referredApplications.length ? (
			<span
				title={
					referredApplications[ 0 ].credited_to
						? referredApplications[ 0 ].credited_to.name
						: 'unknown referrer'
				}
			>
				💯
			</span>
		) : (
			<Unimportant>—</Unimportant>
		);
		const coordinator = isMine ? (
			<strong>Me</strong>
		) : (
			( candidate.coordinator && candidate.coordinator.name ) || <Unimportant>none</Unimportant>
		);
		const coverLetter = this.state.coverLetter ? '☑' : uploadCoverLetter;
		const emails = candidate.email_addresses.length
			? candidate.email_addresses.map( e => e.value ).join( ', ' )
			: add( candidate );
		const pronouns = ( candidate.keyed_custom_fields.pronouns &&
			candidate.keyed_custom_fields.pronouns.value ) || (
			<button name="pronouns" onClick={ this.addPronouns }>
				{ ' ' }
				Add Pronouns
			</button>
		);
		const region =
			( candidate.keyed_custom_fields.region && candidate.keyed_custom_fields.region.value ) ||
			add( candidate );

		const LATE_ACTIVITY_DAYS = 7;
		const daysSinceLastActivity = moment().diff( moment( candidate.last_activity ), 'day' );
		const activityLum = activeApplications > 0 ? 75 : 100;
		const activityHue =
			100 - ( Math.min( daysSinceLastActivity, LATE_ACTIVITY_DAYS ) / LATE_ACTIVITY_DAYS ) * 100;
		const activityHsl = `hsl( ${ activityHue }, 100%, ${ activityLum }% )`;

		return (
			<tr>
				<td className="needs-action">{ needsAction }</td>
				<td>{ jobs }</td>
				<td>{ nameLink }</td>
				<td>{ referral }</td>
				<td>{ coordinator }</td>
				<td style={ { backgroundColor: activityHsl } }>{ daysSinceLastActivity }</td>
				<td>{ coverLetter }</td>
				<td>{ emails }</td>
				<td>{ pronouns }</td>
				<td>{ region }</td>
			</tr>
		);
	}
}
