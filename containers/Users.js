import { Component } from 'react';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { PISTACHIO } from '../data/constants';

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

const mapStateToProps = withSelect( select => {
	return {
		users: select( PISTACHIO ).getUsers(),
	};
} );

const mapDispatchToProps = withDispatch( dispatch => {
	return {
		add: u => dispatch( PISTACHIO ).addUsers( u ),
	};
} );

export default compose( mapStateToProps, mapDispatchToProps )( UsersContainer );
