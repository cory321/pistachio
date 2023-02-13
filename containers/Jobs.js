import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { PISTACHIO_STORE } from '../data/constants';

import { jobs, filters } from '../actions';
import { JOBS_PATH } from '../reducers/filters';
import jobs_data_temp_source from '../jobs.json';

import Jobs from '../components/Jobs';

class JobsContainer extends Component {
	constructor( props ) {
		super( props );

		/* if ( props.jobs.length ) {
			props.fetchNew()
		} else {
			props.fetch()
		} */

		props.addMany( jobs_data_temp_source );
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
		addMany: j => dispatch( jobs.addMany( j ) ),
	};
}

export default connect( mapStateToProps, mapDispatchToProps )( JobsContainer );
