import React, { Component } from 'react';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { PISTACHIO } from '../data/constants';
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

const mapStateToProps = withSelect( select => {
	const store = select( PISTACHIO );
	return {
		jobs: store.getJobs(),
		error: store.isFetchingJobs().error,
		currentFilter:
			store
				.getFilters()
				.filter( filter => filter.path === JOBS_PATH )
				.map( filter => filter.values )[ 0 ] || [],
	};
} );

const mapDispatchToProps = withDispatch( dispatch => {
	const actions = dispatch( PISTACHIO );
	return {
		fetch: () => actions.fetchJobs(),
		fetchNew: () => actions.fetchNewJobs(),
		filter: job_ids => actions.jobsFilters( job_ids ),
		add: j => actions.addJobs( j ),
		addMany: j => actions.addManyJobs( j ),
	};
} );

export default compose( mapStateToProps, mapDispatchToProps )( JobsContainer );
