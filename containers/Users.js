import React, { Component } from 'react';
import { connect } from 'react-redux';

import { users } from '../actions';

class UsersContainer extends Component {
	constructor( props ) {
		super( props );
		props.add( {
			created_at: '2016-02-25T18:20:37.742Z',
			disabled: false,
			emails: [ 'test@example.com' ],
			employee_id: null,
			first_name: 'Test',
			id: 219748,
			last_name: 'Testerson',
			name: 'Test Testerson',
			site_admin: true,
			updated_at: '2018-05-07T18:21:20.481Z',
		} );
	}

	render() {
		return null;
	}
}

function mapStateToProps( state ) {
	return {
		users: state.users,
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		add: u => dispatch( users.add( u ) ),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( UsersContainer );
