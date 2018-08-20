/** @format */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Greenhouse from '../components/Greenhouse';
//import Gmail from '../components/Gmail'

class ToolsContainer extends Component {
	render() {
		let tool;
		switch ( this.props.tool ) {
			case 'gmail':
				//tool = <Gmail />
				tool = null;
				break;
			default:
				tool = <Greenhouse />;
				break;
		}

		return [
			<nav key="tools">
				<ul>
					<li>
						<a href="#greenhouse">Greenhouse</a>
					</li>
					<li>
						<a href="#gmail">Gmail</a>
					</li>
				</ul>
			</nav>,
			<div key="tool">{ tool }</div>,
		];
	}
}

function mapStateToProps( state ) {
	return {
		tool: state.route,
	};
}

export default connect( mapStateToProps )( ToolsContainer );
