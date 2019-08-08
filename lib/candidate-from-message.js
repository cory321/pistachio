import findIndex from 'lodash.findindex';
import titleCase from 'title-case';

import normalize from './gmail-normalize';
import removeAccents from './remove-accents';
import sourceFromPlusAddress from './source-from-plus-address';
import jobIdfromLabelId from './job-id-from-label-id';
import attachmentsFromMessage from './attachments-from-message';

const SOURCE_REFERRAL = 13;

function addressFormat( address ) {
	return address.name ? `${ address.name } <${ address.address }>` : address.address;
}

export function headersFromMessage( normalized ) {
	const headers = [
		`From   : ${ addressFormat( normalized.from ) }`,
		`Date   : ${ normalized.date.toUTCString().replace( /GMT/, normalized.utcOffset || 'GMT' ) }`,
		`Subject: ${ normalized.subject }`,
		`To     : ${ ( normalized.to || [] ).map( addressFormat ).join( ', ' ) }`,
	];

	if ( normalized.cc ) {
		headers.push( `CC     : ${ normalized.cc.map( addressFormat ).join( ', ' ) }` );
	}

	return headers;
}

export default function onBehalfOf( user_id ) {
	return function candidateFromMessage( message ) {
		const normalized = normalize( message );

		let name = normalized.from.name;
		// @todo - Unicode property for uppercase?
		if ( name && ! removeAccents( name ).match( /[A-Z]/ ) ) {
			name = titleCase( name );
		}

		const nameParts = name.split( /\s+/ );

		const [ first_name, ...tailParts ] = nameParts;

		// bin, de, ver, etc.
		const lastito = findIndex( tailParts, part => ! removeAccents( part ).match( /[A-Z]/ ) );

		let last_name;
		if ( ~lastito ) {
			last_name = tailParts.slice( lastito ).join( ' ' );
		} else {
			last_name = tailParts.slice( -1 )[ 0 ];
		}

		const email_addresses = [
			{
				value: normalized.from.address,
				type: 'personal',
			},
		];

		const activity_feed_notes = [
			{
				user_id,
				body: 'Imported from Pistachio',
				visibility: 'public',
			},
		];

		const recipients = ( normalized.to || [] ).concat( normalized.cc || [] );

		/**
		 * Sourcing
		 * @var array { name: human readable, id: Greenhouse Source ID }
		 *
		 * The first source in the array will be used as the source for Greenhouse
		 * All sources will be added to the Cover Letter/Intro doc.
		 */
		let sources = [];

		// A8C Referrals
		const a11ns = recipients.filter( recipient => {
			if ( ! recipient.address ) {
				return false;
			}

			const address = recipient.address.toLowerCase();

			return (
				! address.match( /^jobs(\+.+)?@/ ) && // jobs+...@ and jobs@
				( ~address.indexOf( '@automattic.com' ) || ~address.indexOf( '@a8c.com' ) )
			);
		} );

		sources = sources.concat(
			a11ns.map( a11n => ( {
				name: a11n.name ? `${ a11n.name } <${ a11n.address }>` : a11n.address,
				id: SOURCE_REFERRAL,
			} ) )
		);

		// jobs+foo@ addresses
		const plusSources = recipients
			.map( recipient => {
				const plus = recipient.address.match( /^jobs\+(.+)@/ ); // Only jobs+...@
				return plus ? plus[ 1 ] : false;
			} )
			.filter( plus => plus ) // Only the TOs that are jobs+...@
			.map( sourceFromPlusAddress );

		// Add all plus addresses, regardless of whether the correspond to
		// a known source
		sources = sources.concat( plusSources );

		const attachments = attachmentsFromMessage( message );

		let headers = headersFromMessage( normalized );

		const extraHeaders = [];

		if ( sources.length ) {
			extraHeaders.push( `Sources: ${ sources.map( source => source.name ).join( ', ' ) }` );
		}

		if ( extraHeaders.length ) {
			headers = headers.concat( '********', extraHeaders, '********' );
		}

		const coverLetterIntro = new Promise( ( resolve, reject ) => {
			const reader = new FileReader();

			reader.addEventListener(
				'load',
				event => {
					resolve( event.target.result.split( ';base64,' )[ 1 ] );
				},
				false
			);

			reader.addEventListener(
				'error',
				event => {
					reject( event.error );
				},
				false
			);

			reader.readAsDataURL(
				new Blob( [ headers.join( '\n' ), '\n\n', normalized.body ], { type: 'text/plain' } )
			);
		} );

		attachments.push( {
			filename: `${ name } - Cover Letter Intro.txt`,
			type: 'cover_letter',
			content_type: 'text/plain',
			content: coverLetterIntro,
		} );

		const applications = [
			{
				job_id: message.labelIds.map( jobIdfromLabelId ).filter( jobId => !! jobId )[ 0 ],
				// The first source with a real ID (referral, known plus address)
				source_id: sources
					.map( source => source.id )
					.filter( sourceId => sourceId )
					.shift(),
				referrer: a11ns.length
					? {
							type: 'outside',
							value: a11ns[ 0 ].name || a11ns[ 0 ].address,
					  }
					: undefined,
				attachments,
			},
		];

		return {
			first_name: first_name || 'UNKNOWN',
			last_name: last_name || 'UNKNOWN',
			email_addresses,
			activity_feed_notes,
			applications,
		};
	};
}
