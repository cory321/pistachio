import React, { Component } from 'react';

import { ChevronDown, ChevronRight } from '../lib/grid-icons';

export default class Auth extends Component {
	constructor( props ) {
		super( props );

		this.state = { open: false };

		this.toggle = this.toggle.bind( this );
		this.logIn = this.logIn.bind( this );
		this.logOut = this.logOut.bind( this );
	}

	toggle() {
		this.setState( { open: ! this.state.open } );
	}

	render() {
		const { open } = this.state;

		const services = [ 'slack', 'greenhouse', 'wpcom', 'github' ];

		return (
			<ul className={ [ 'auths' ].concat( open ? [] : [ 'collapsed' ] ).join( ' ' ) }>
				<li key="toggle" className="toggle">
					<span onClick={ this.toggle }>
						{ open ? ChevronDown( { size: 36 } ) : ChevronRight( { size: 36 } ) }
					</span>
				</li>
				{ services.map( service => {
					switch ( service ) {
						case 'gmail':
							return null;
						default:
							return null;
					}
				} ) }
			</ul>
		);
	}
}
