import React, { Component } from 'react';
import moment from 'moment';

import allAt from '../lib/all-at';
import { MISSING_COVER_LETTER_PATH } from '../reducers/filters';
import A8cBadge from './A8cBadge';
import Actions from './Actions';
import HoverRow from './HoverRow';

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
			'uploadCoverLetter',
			'uploadTranscript',
			'addPronouns',
			'addEmailAddress',
		] ) {
			this[ func ] = this[ func ].bind( this );
		}

		this.state = {
			coverLetter: coverLetter( props.candidate ),
			interviewTranscript: interviewTranscript( props.candidate ),
		};
	}

	UNSAFE_componentWillReceiveProps( nextProps ) {
		this.setState( {
			coverLetter: coverLetter( nextProps.candidate ),
			interviewTranscript: interviewTranscript( nextProps.candidate ),
		} );
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

	addEmailAddress( event ) {
		event.preventDefault();
		const emailAddress = window.prompt( 'Email Address?', '' ); // obviously we want to show a dropdown here :)
		this.props.addEmailAddress( this.props.candidate, emailAddress );
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
			<button className="button" onClick={ this.uploadCoverLetter } disabled={ isFetching }>
				Upload
			</button>
		);
		const isMine =
			currentUser && candidate.coordinator && currentUser.id === candidate.coordinator.id;
		const activeApplications = candidate.applications.filter(
			application => 'active' === application.status
		).length;

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

		let referral = <Unimportant>—</Unimportant>;

		if ( a8cBadge ) {
			referral = a8cBadge;
		} else if ( referredApplications.length ) {
			referral = (
				<span
					title={
						referredApplications[ 0 ].credited_to
							? referredApplications[ 0 ].credited_to.name
							: 'unknown referrer'
					}
				>
					💯
				</span>
			);
		}

		const coordinator = isMine ? (
			<strong>Me</strong>
		) : (
			( candidate.coordinator && candidate.coordinator.name ) || <Unimportant>none</Unimportant>
		);
		const coverLetter = this.state.coverLetter ? '☑' : uploadCoverLetter;
		// debugger;
		const emails = candidate.email_addresses.length
			? candidate.email_addresses.map( e => e.value ).join( ', ' )
			: add( candidate );
		const pronouns = ( candidate.keyed_custom_fields.pronouns &&
			candidate.keyed_custom_fields.pronouns.value ) || (
			<button className="button" name="pronouns" onClick={ this.addPronouns }>
				{ ' ' }
				Add Pronouns
			</button>
		);
		const region =
			( candidate.keyed_custom_fields.region && candidate.keyed_custom_fields.region.value ) ||
			add( candidate );

		return (
			<HoverRow { ...this.props }>
				<td>{ jobs }</td>
				<td>{ nameLink }</td>
				<td>{ emails }</td>
				<td>{ pronouns }</td>
				<td>{ region }</td>
				<td>{ referral }</td>
				<td>{ coverLetter }</td>
				<td>{ coordinator }</td>
				<Actions { ...this.props } />
			</HoverRow>
		);
	}
}
