/** @format */

import addressparser from 'addressparser';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import diff from 'lodash.xor';

import { messageQuery, messages, senderCounts } from '../actions';

import Messages from '../components/Messages';

class MessagesContainer extends Component {
	constructor( props ) {
		super( props );

		this.fetch( props.query );
	}

	componentWillReceiveProps( nextProps ) {
		if ( nextProps.query !== this.props.query ) {
			this.fetch( nextProps.query );
		}
	}

	fetch( query ) {
		this.props.fetch( query ).then( messages => this.props.fetchCounts( messages ) );
	}

	render() {
		return (
			<Messages
				messages={ this.props.messages }
				senderCounts={ this.props.senderCounts }
				importedLabelId={ this.props.importedLabelId }
				isFetching={ this.props.isFetching }
				candidatesEmails={ this.props.candidatesEmails }
				setQuery={ this.props.setQuery }
				getAttachment={ this.props.getAttachment }
				addLabel={ this.props.addLabel }
				importToGreenhouse={ this.props.importToGreenhouse }
				setName={ this.props.setName }
			/>
		);
	}
}

function mapStateToProps( state ) {
	const importedLabelId = (
		state.labels.filter( label => label.name === 'Imported' )[ 0 ] || { id: false }
	).id;

	return {
		query: state.messageQuery,
		// When we import messages, we add the label in Gmail and then refresh just those
		// messages (so that our state reflects the newly added label). We do not ask Gmail
		// for the results of the full messageQuery again.
		// That means we end up with imported messages in our messages state. If the current
		// messageQuery includes '-label:imported' (a "normal" query), filter those imported
		// messages out from display. Otherwise (a custom query), display all messages.
		messages: state.messageQuery.includes( '-label:imported' )
			? state.messages.filter( message => ! message.labelIds.includes( importedLabelId ) )
			: state.messages,
		senderCounts: state.senderCounts,
		importedLabelId,
		isFetching: state.fetchers.messages.isFetching,

		candidatesEmails: [].concat(
			...state.candidates.map( candidate =>
				candidate.email_addresses.map( address => ( { email: address.value, id: candidate.id } ) )
			)
		),
	};
}

function sendersFromMessages( messages ) {
	const fromAddresses = messages
		.map( message => message.payload.headers.find( header => 'From' === header.name ) )
		.map( header => header.value )
		.map( from => ( addressparser( from ).shift() || { address: 'noop@noop.noop' } ).address );

	return Array.from( new Set( fromAddresses ) );
}

function mapDispatchToProps( dispatch ) {
	return {
		fetch: query => dispatch( messages.fetch( query ) ),
		fetchCounts: messages => dispatch( senderCounts.fetch( sendersFromMessages( messages ) ) ),
		setQuery: query => dispatch( messageQuery.set( query ) ),

		getAttachment: ( messageId, attachment ) =>
			dispatch( messages.getAttachment( messageId, attachment ) ),
		addLabel: ( messageIds, labelId ) => dispatch( messages.addLabel( messageIds, labelId ) ),
		importToGreenhouse: ( messageIds, attachmentIdsToExclude ) =>
			dispatch( messages.importToGreenhouse( messageIds, attachmentIdsToExclude ) ),
		setName: ( messageId, name ) => dispatch( messages.setName( messageId, name ) ),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( MessagesContainer );
