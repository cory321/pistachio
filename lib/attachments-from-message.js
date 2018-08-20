/** @format */

import removeAccents from './remove-accents';
import { partsFromMessage } from './gmail-normalize';

export default function attachmentsFromMessage( message ) {
	return (
		partsFromMessage( message )
			// Good enough?
			.filter( part => 'application' === part.mimeType.split( '/' )[ 0 ] )
			.map( part => {
				const nameNoAccents = removeAccents( part.filename );

				console.log( part );

				// @todo library
				let mimeType = part.mimeType;
				if ( 'application/octet-stream' === mimeType ) {
					switch ( nameNoAccents.split( '.' ).slice( -1 )[ 0 ] ) {
						case 'pdf':
							mimeType = 'application/pdf';
							break;
						case 'docx':
							mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
							break;
					}
				} else {
					switch ( nameNoAccents.split( '.' ).slice( -1 )[ 0 ] ) {
						case 'pdf': // application/pdf
							// Sometimes served as "application/force-download"
							// renormalize to the correct MIME Type
							mimeType = 'application/pdf';
							break;
						case 'doc': // application/msword
						case 'asc': // appliation/pgp-signature
						case 'odt': // application/vnd.oasis.opendocument.text
						case 'rtf': // application/rtf
							// https://developers.greenhouse.io/harvest.html#post-add-attachment
							// These MIME types are not allowed in the API even though
							// they can be uploaded via the website. The content_type property isn't
							// strictly required by the API, so...
							mimeType = undefined;
							break;
					}
				}

				return {
					filename: part.filename,
					type: nameNoAccents.match( /cover|intro/i ) ? 'cover_letter' : 'resume',
					content_type: mimeType,
					id: part.body.attachmentId,
				};
			} )
	);
}
