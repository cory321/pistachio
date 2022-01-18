import React, { Component } from 'react';

import { headersFromMessage } from '../lib/candidate-from-message';
import normalize from '../lib/gmail-normalize';
import { External } from '../lib/grid-icons';
import A8cBadge from './A8cBadge.js';
import Attachments from './Attachments';

function dateFormat( dateObject ) {
	const [ date, time ] = dateObject.toISOString().split( 'T' );
	return (
		date.split( '-' ).slice( 1, 3 ).join( '/' ) + ' ' + time.split( ':' ).slice( 0, 2 ).join( ':' )
	);
}

class MessageName extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			name: props.name,
			editing: false,
		};

		this.openEditor = this.openEditor.bind( this );
		this.change = this.change.bind( this );
		this.submit = this.submit.bind( this );
	}

	componentWillReceiveProps( nextProps ) {
		if ( this.props.name !== nextProps.name ) {
			this.setState( { name: nextProps.name, editing: false } );
		}
	}

	openEditor( event ) {
		event.preventDefault();

		this.setState( { editing: true } );
	}

	change( event ) {
		this.setState( { name: event.target.value } );
	}

	submit( event ) {
		event.preventDefault();

		this.setState( { editing: false } );

		this.props.setName( this.state.name );
	}

	render() {
		const { editing, name } = this.state;

		if ( editing ) {
			return (
				<form className="fn" onSubmit={ this.submit }>
					<input type="text" onChange={ this.change } value={ name } />
				</form>
			);
		}
		return (
			<span className="fn" onContextMenu={ this.openEditor }>
				{ name }
			</span>
		);
	}
}

function failedImportMessage( failure ) {
	let message = '';
	switch ( failure ) {
		case 'attachment-content-type':
			message = 'Invalid Attachment Content-Type';
	}

	message = message ? `Failed Import: ${ message }` : 'Failed Import';
	return <strong className="error">{ message }</strong>;
}

export default class Messages extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			checked: {},
			showAttachments: false,
			excludedAttachments: {},
		};

		this.viewMessage = this.viewMessage.bind( this );
		this.change = this.change.bind( this );
		this.searchBySender = this.searchBySender.bind( this );
		this.markAsImported = this.markAsImported.bind( this );
		this.importToGreenhouse = this.importToGreenhouse.bind( this );
		this.toggleAttachments = this.toggleAttachments.bind( this );
	}

	componentWillReceiveProps( nextProps ) {
		// Remove checked keys whose messages have gone away
		// Remove checked keys whose messages have been imported to greenhouse but are still here
		// (because of unimported attachments)
		const checked = Object.keys( this.state.checked ).reduce( ( checked, key ) => {
			const message = nextProps.messages.find( message => message.id === key );
			if (
				message &&
				! ( 'meta' in message && 'greenhouse' in message.meta && message.meta.greenhouse )
			) {
				return { ...checked, [ key ]: this.state.checked[ key ] };
			}

			return checked;
		}, {} );

		// Remove excludedAttachments whose messages have gone away
		const excludedAttachments = Object.keys( this.state.excludedAttachments ).reduce(
			( excludedAttachments, key ) => {
				if ( nextProps.messages.some( message => message.id === key ) ) {
					return { ...excludedAttachments, [ key ]: this.state.excludedAttachments[ key ] };
				}

				return excludedAttachments;
			},
			{}
		);

		this.setState( {
			checked,
			excludedAttachments,
		} );
	}

	markAsImported( event ) {
		event.preventDefault();

		const ids = Object.keys( this.state.checked ).filter( id => this.state.checked[ id ] );

		this.props
			.addLabel( ids, this.props.importedLabelId )
			.then( _ => alert( 'Done! To undo, remove the Imported label from the messages in Gmail.' ) );
	}

	importToGreenhouse( event ) {
		event.preventDefault();

		const ids = Object.keys( this.state.checked ).filter( id => this.state.checked[ id ] );
		const attachmentIdsToExclude = [].concat( ...Object.values( this.state.excludedAttachments ) );
		console.log( 'to exclude', attachmentIdsToExclude );

		this.props.importToGreenhouse( ids, attachmentIdsToExclude ).then( console.log );
	}

	// Party like it's 1999
	viewMessage( event ) {
		event.preventDefault();

		const messageId = event.currentTarget.name;
		const raw = this.props.messages.find( message => message.id === messageId );
		const message = normalize( raw );

		const headers = headersFromMessage( message );

		const width = Math.min( 640, screen.availWidth / 2 );
		const height = Math.min( 600, screen.availHeight / 2 );

		const left = window.screenLeft + ( window.outerWidth - width ) / 2;
		const top = window.screenTop + ( window.outerHeight - height ) / 2;

		const pop = window.open(
			'',
			messageId,
			`menubar=0,toolbar=0,location=0,personalbar=0,status=0,scrollbars=1,width=${ width },height=${ height }`
		);
		pop.moveTo( left, top );
		pop.resizeTo( width, height );

		pop.document.body.innerHTML = '<pre style="white-space: pre-wrap;"></pre>';
		pop.document.getElementsByTagName( 'pre' )[ 0 ].innerText =
			headers.join( '\n' ) + '\n\n' + message.body;
	}

	toggleAttachments( event ) {
		event.preventDefault();

		this.setState( { showAttachments: ! this.state.showAttachments } );
	}

	change( event ) {
		this.setState( {
			checked: { ...this.state.checked, [ event.target.name ]: event.target.checked },
		} );
	}

	searchBySender( event ) {
		event.preventDefault();

		this.props.setQuery( 'from:' + event.target.href.split( '#' )[ 1 ] );
	}

	// Add to the exclude list
	excludeAttachment( messageId, attachmentId ) {
		const newState = ( messageId in this.state.excludedAttachments
			? this.state.excludedAttachments[ messageId ].filter(
					excludedAttachmentId => excludedAttachmentId !== attachmentId
			  )
			: []
		).concat( [ attachmentId ] );

		this.setState( {
			excludedAttachments: { ...this.state.excludedAttachments, [ messageId ]: newState },
		} );
	}

	// Remove from the exclude list
	includeAttachment( messageId, attachmentId ) {
		const newState =
			messageId in this.state.excludedAttachments
				? this.state.excludedAttachments[ messageId ].filter(
						excludedAttachmentId => excludedAttachmentId !== attachmentId
				  )
				: [];

		this.setState( {
			excludedAttachments: { ...this.state.excludedAttachments, [ messageId ]: newState },
		} );
	}

	render() {
		const { messages, isFetching } = this.props;
		const { checked, showAttachments } = this.state;
		const anyChecked = Object.keys( checked ).some( id => checked[ id ] );

		return [
			messages.length ? (
				<ul className={ 'messages' + ( isFetching ? ' fetching' : '' ) } key="messages">
					{ messages.map( message => this.renderMessage( message ) ) }
				</ul>
			) : (
				<p key="empty" className={ isFetching ? 'fetching' : '' }>
					{ isFetching ? 'Loading…' : 'No messages' }
				</p>
			),
			<div key="bulk">
				<button className="primary" onClick={ this.importToGreenhouse } disabled={ ! anyChecked }>
					Import to Greenhouse
				</button>
				<button className="danger" onClick={ this.markAsImported } disabled={ ! anyChecked }>
					Mark as Imported
				</button>
				<button id="attachments-toggle" onClick={ this.toggleAttachments }>
					{ showAttachments ? 'Hide Attachments' : 'Show Attachments' }
				</button>
			</div>,
		];
	}

	renderMessage( raw ) {
		const { candidatesEmails, senderCounts, setName, getAttachment, importedLabelId } = this.props;
		const { showAttachments, excludedAttachments } = this.state;

		const message = normalize( raw );

		const candidateEmail = candidatesEmails.filter(
			candidate => message.from.address === candidate.email
		)[ 0 ];
		// This candidate exists in Greenhouse already due to a previous application
		const already = candidateEmail ? (
			<a
				target="_blank"
				href={ 'https://app.greenhouse.io/people/' + candidateEmail.id }
				rel="noreferrer"
			>
				Already in Greenhouse
			</a>
		) : null;

		// This candidate exists in Greenhouse because we just imported this exact message
		const greenhouseId = 'meta' in raw && 'greenhouse' in raw.meta && raw.meta.greenhouse;
		const greenhouseLink = greenhouseId ? (
			<strong className="error">
				Finish Import Manually:{ ' ' }
				<a
					href={ `https://app.greenhouse.io/people/${ greenhouseId }` }
					target="_blank"
					rel="noreferrer"
				>
					Greenhouse Details
				</a>
			</strong>
		) : null;

		const senderCount = senderCounts[ message.from.address ] || Infinity;

		const senderCountLink = isFinite( senderCount ) ? (
			<a href={ '#' + message.from.address } onClick={ this.searchBySender }>
				[{ senderCount }]
			</a>
		) : (
			'[…]'
		);

		const emailAddress =
			senderCount > 1 ? (
				<span className="email-address">
					{ message.from.address } { senderCountLink }
				</span>
			) : (
				<span className="email-address">{ message.from.address }</span>
			);

		const failedImport = 'meta' in raw && 'failure' in raw.meta && raw.meta.failure;

		const meta = greenhouseId
			? greenhouseLink
			: failedImport
			? failedImportMessage( failedImport )
			: null;

		const imported = raw.labelIds.includes( importedLabelId ) ? (
			<span className="imported">Imported</span>
		) : (
			''
		);

		return (
			<li key={ message.id }>
				<label>
					<input
						type="checkbox"
						name={ message.id }
						checked={ !! this.state.checked[ message.id ] }
						onChange={ this.change }
						disabled={ imported }
					/>{ ' ' }
					<A8cBadge emails={ message.from.address } />{ ' ' }
					<MessageName name={ message.from.name } setName={ name => setName( message.id, name ) } />{ ' ' }
					{ emailAddress }
				</label>
				<span className="message">
					{ imported }
					<span className="subject">
						{ message.subject } { already }
					</span>
					<span className="snippet" title={ message.snippet }>
						{ message.snippet }
					</span>
				</span>
				<span>
					<a href="#" name={ message.id } onClick={ this.viewMessage }>
						<External />
					</a>
				</span>
				<time dateTime={ message.date.toISOString() }>{ dateFormat( message.date ) }</time>
				{ meta }
				<Attachments
					attachments={ message.attachments }
					showAttachments={ showAttachments || failedImport }
					excludedAttachments={
						message.id in excludedAttachments ? excludedAttachments[ message.id ] : []
					}
					getAttachment={ attachment => getAttachment( message.id, attachment ) }
					excludeAttachment={ attachmentId => this.excludeAttachment( message.id, attachmentId ) }
					includeAttachment={ attachmentId => this.includeAttachment( message.id, attachmentId ) }
				/>
			</li>
		);

		// We always render Attachments. If we selectively rendered it, any already downloaded attachments would be revoked
		// when we removed Attachments, and we'd have to download them again if we added Attachments back and then requested
		// those attachments again. See Attachments.componentWillUnmount()
	}
}
