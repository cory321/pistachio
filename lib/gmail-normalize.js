/** @format */

import addressparser from 'addressparser';
import unescapeHTML from 'unescape-html';

// Only works for text (must output a valid UTF-8 string)
function decode64( encoded ) {
	// JavaScript is awesome.
	return decodeURIComponent( escape( atob( normalizedBase64( encoded ) ) ) );
}

// Works for all files
export function fileFromBase64( base64, name = '', type = '' ) {
	const sliceSize = 16 * 1024;

	const chrs = atob( base64 );
	const slices = [];

	for ( let offset = 0; offset < chrs.length; offset += sliceSize ) {
		const ords = [ ...chrs.slice( offset, offset + sliceSize ) ].map( chr => chr.charCodeAt( 0 ) );

		slices.push( new Uint8Array( ords ) );
	}

	return new File( slices, name, { type } );
}

export function normalizedBase64( base64urlEncoded ) {
	return base64urlEncoded.replace( /-/g, '+' ).replace( /_/g, '/' );
}

export function partsFromMessage( message ) {
	return allParts( message.payload.parts );
}

function allParts( parts ) {
	let out = [];

	if ( ! parts ) {
		return out;
	}

	for ( const part of parts ) {
		switch ( part.mimeType.split( '/' )[ 0 ] ) {
			case 'multipart':
				out = out.concat( allParts( part.parts ) );
				break;
			default:
				out = [ ...out, part ];
				break;
		}
	}

	return out;
}

function plainParts( parts ) {
	return parts.filter( part => 'text' === part.mimeType.split( '/' )[ 0 ] );
}

function attachmentParts( parts ) {
	return parts.filter( part => part.filename.length );
}

export default function normalize( message ) {
	let normalized = {
		id: message.id,
		threadId: message.threadId,
		snippet: unescapeHTML( message.snippet ),
		date: new Date( parseInt( message.internalDate, 10 ) ),
	};

	normalized = message.payload.headers.reduce( ( normalized, header ) => {
		const name = header.name.toLowerCase();
		switch ( name ) {
			case 'from':
				return Object.assign( { from: addressparser( header.value ).shift() }, normalized );
			case 'to':
			case 'cc':
				return Object.assign( { [ name ]: addressparser( header.value ) }, normalized );
			case 'date':
				const matches = header.value.match( /[+-]\d+$/ );
				const utcOffset = ( matches && 0 < matches.length && matches[ 0 ] ) || '';
				return Object.assign(
					{
						date: new Date( header.value ),
						utcOffset,
					},
					normalized
				);
			case 'subject':
				return Object.assign( { subject: header.value }, normalized );
			case 'message-id':
				return Object.assign( { messageId: header.value }, normalized );
		}

		return normalized;
	}, normalized );

	let body = '';
	const allPartsOfMessage = allParts( message.payload.parts );

	if ( message.payload.body.data ) {
		body = message.payload.body.data;
	} else {
		const part = plainParts( allPartsOfMessage ).shift();
		if ( part && part.body.data ) {
			body = part.body.data;
		}
	}

	const attachments = attachmentParts( allPartsOfMessage ).map( part => ( {
		filename: part.filename,
		mimeType: part.mimeType,
		attachmentId: part.body.attachmentId,
		size: part.body.size,
	} ) );

	return Object.assign( { body: decode64( body ), attachments }, normalized );
}
