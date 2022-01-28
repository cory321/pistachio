import React, { Component } from 'react';
import { compose } from '@wordpress/compose';
import { merge } from 'lodash';

import Candidates from '../components/Candidates';

import '@wordpress/core-data';
import { withSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

class CandidateContainer extends Component {
	render() {
		return (
			<Candidates
				candidates={ this.props.candidates }
				error={ this.props.error }
				isFetching={ this.props.isFetching }
				currentUser={ this.props.currentUser }
				refresh={ this.props.fetchOne }
				uploadCoverLetter={ this.props.uploadCoverLetter }
				addPronouns={ this.addPronouns }
				toggleNeedsAction={ this.props.toggleNeedsAction }
			/>
		);
	}

	addPronouns( candidate, pronouns ) {
		apiFetch( {
			path: '/wp/v2/candidates/' + candidate.id,
			method: 'POST',
			data: {
				json: merge( {}, candidate, {
					keyed_custom_fields: {
						pronouns: {
							value: pronouns,
						},
					},
				} ),
			},
		} );
	}
}

export default compose( [
	withSelect( select => {
		return {
			candidates: select( 'core' ).getEntityRecords( 'postType', 'candidate', { per_page: 300 } ),
			error: null,
			isFetching: false,
			currentUser: null,
		};
	} ),
] )( CandidateContainer );
