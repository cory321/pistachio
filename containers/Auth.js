import React, { Component } from 'react';
import { connect } from 'react-redux';

import { auth } from '../actions';

import Auth from '../components/Auth';

class AuthContainer extends Component {
	componentDidMount() {
		window.authReceiver = this.props.logIn;
	}

	componentDidUpdate() {
		window.authReceiver = this.props.logIn;
	}

	componentWillUnmount() {
		delete window.authReceiver;
	}

	render() {
		return <Auth auth={ this.props.auth } logOut={ this.props.logOut } />;
	}
}

function mapStateToProps( state ) {
	return {
		auth: state.auth,
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		logIn: ( service, data ) => dispatch( auth.logIn( service, data ) ),
		logOut: service => dispatch( auth.logOut( service ) ),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( AuthContainer );
