/** @format */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { queryParameterFromLabel, changeQueryLabels } from '../lib/query';

import { labels, messageQuery } from '../actions';

import Labels from '../components/Labels';

class LabelsContainer extends Component {
	constructor( props ) {
		super( props );

		const lastFetched = new Date(
			'0000-00-00T00:00:00.000Z' === props.lastFetched ? 0 : props.lastFetched
		);

		if ( ! props.labels.length ) {
			props.fetch();
		} else if ( lastFetched.valueOf() < Date.now() - 3600000 * 24 ) {
			props.fetch();
		}

		this.setLabels = this.setLabels.bind( this );
		this.setQuery = this.setQuery.bind( this );
	}

	setLabels( labelIds ) {
		this.setQuery( changeQueryLabels( this.props.query, this.props.labels, labelIds ) );
	}

	setQuery( query ) {
		this.props.setQuery( query );
	}

	render() {
		const queryLabel = ( this.props.query
			.replace( /-label:[a-z0-9-]+/g, '' )
			.match( /label:position-.*/g ) || [ undefined ] )[ 0 ];

		// If there's no label in the query, set the queryLabelId to undefined so that the select keeps whatever its current value is.
		const queryLabelId = (
			this.props.labels.find( label => queryParameterFromLabel( label ) === queryLabel ) || {
				id: undefined,
			}
		).id;

		return (
			<Labels
				labels={ this.props.labels }
				queryLabelId={ queryLabelId }
				jobs={ this.props.jobs }
				query={ this.props.query }
				setLabels={ this.setLabels }
				setQuery={ this.setQuery }
				refresh={ this.props.fetch }
			/>
		);
	}
}

function mapStateToProps( state ) {
	return {
		labels: state.labels.filter( ( { name } ) => 0 === name.indexOf( 'Position/' ) ),
		jobs: state.jobs,
		query: state.messageQuery,

		lastFetched: state.lastFetched.labels,
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		fetch: () => dispatch( labels.fetch() ),
		setQuery: query => dispatch( messageQuery.set( query ) ),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( LabelsContainer );
