import React, { Component } from 'react';
import { connect } from 'react-redux';

import { jobs, filters } from '../actions';
import { JOBS_PATH } from '../reducers/filters';

import Jobs from '../components/Jobs';

class JobsContainer extends Component {
	constructor( props ) {
		super( props );

		/* if ( props.jobs.length ) {
			props.fetchNew()
		} else {
			props.fetch()
		} */

		props.add( {
			name: 'Code Wrangler',
			departments: [
				{
					child_ids: [],
					external_id: null,
					id: 45284,
					name: 'Web',
					parent_id: 44211,
				},
			],
			id: 576226,
			offices: [
				{
					child_ids: [],
					external_id: null,
					id: 44811,
					location: { name: null },
					name: 'Web',
					parent_id: 43792,
				},
			],
			status: 'open',
		} );
	}

	render() {
		return (
			<Jobs
				jobs={ this.props.jobs }
				error={ this.props.error }
				filter={ this.props.filter }
				currentFilter={ this.props.currentFilter }
			/>
		);
	}
}

function mapStateToProps( state ) {
	return {
		jobs: state.jobs,
		error: state.fetchers.jobs.error,
		currentFilter:
			state.filters
				.filter( filter => filter.path === JOBS_PATH )
				.map( filter => filter.values )[ 0 ] || [],
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		fetch: () => dispatch( jobs.fetch() ),
		fetchNew: () => dispatch( jobs.fetchNew() ),
		filter: job_ids => dispatch( filters.jobs( job_ids ) ),
		add: j => dispatch( jobs.add( j ) ),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( JobsContainer );
