import React, { Component } from 'react';
import { compose } from '@wordpress/compose';
import { merge } from 'lodash';

import { candidates } from '../actions';
import Candidates from '../components/Candidates';

const { withSelect } = wp.data;
const { apiFetch } = wp;

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
				addGender={ this.addGender }
				toggleNeedsAction={ this.props.toggleNeedsAction }
			/>
		);
	}

	addGender( candidate, gender ) {
		apiFetch( {
			path: '/wp/v2/candidates/' + candidate.id,
			method: 'POST',
			data: {
				json: merge( {}, candidate, {
					keyed_custom_fields: {
						gender: {
							value: gender,
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
