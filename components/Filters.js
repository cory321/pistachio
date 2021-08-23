import React, { Component } from 'react';

import Jobs from '../containers/Jobs';

import {
	STATUS_PATH,
	MISSING_COVER_LETTER_PATH,
	MISSING_EMAIL_ADDRESS_PATH,
	MISSING_DEMOGRAPHICS_PATH,
	COORDINATOR_PATH,
	NEEDS_ACTION_PATH,
} from '../reducers/filters';

export default class Filters extends Component {
	constructor( props ) {
		super( props );

		this.checkbox = this.checkbox.bind( this );
		this.select = this.select.bind( this );

		this.state = {
			status: this.which( this.props.filters, STATUS_PATH ),
			coordinator: this.which( this.props.filters, COORDINATOR_PATH ),
			missingCoverLetter: this.isActive( this.props.filters, MISSING_COVER_LETTER_PATH ),
			missingEmailAddress: this.isActive( this.props.filters, MISSING_EMAIL_ADDRESS_PATH ),
			missingDemographics: this.isActive( this.props.filters, MISSING_DEMOGRAPHICS_PATH ),
			needsAction: this.isActive( this.props.filters, NEEDS_ACTION_PATH ),
		};
	}

	componentWillReceiveProps( nextProps ) {
		this.setState( {
			status: this.which( nextProps.filters, STATUS_PATH ),
			coordinator: this.which( nextProps.filters, COORDINATOR_PATH ),
			missingCoverLetter: this.isActive( nextProps.filters, MISSING_COVER_LETTER_PATH ),
			missingEmailAddress: this.isActive( nextProps.filters, MISSING_EMAIL_ADDRESS_PATH ),
			missingDemographics: this.isActive( nextProps.filters, MISSING_DEMOGRAPHICS_PATH ),
			needsAction: this.isActive( nextProps.filters, NEEDS_ACTION_PATH ),
		} );
	}

	checkbox( event ) {
		this.props[ event.target.name ]( event.target.checked );
	}

	select( event ) {
		let { name, value } = event.target;
		value = value ? [ value ] : [];

		switch ( name ) {
			case 'coordinator':
				value = value.map( value => parseInt( value, 10 ) );
				break;
			case 'status':
				break;
		}

		this.props[ name ]( value );
	}

	isActive( filters, path ) {
		return filters.some( filter => filter.path === path );
	}

	which( filters, path ) {
		const value = filters
			.filter( filter => filter.path === path )
			.map( filter => filter.values )[ 0 ];

		return 'undefined' === typeof value ? [] : value;
	}

	render() {
		const { coordinators, currentUser } = this.props;

		const status = 'undefined' === typeof this.state.status[ 0 ] ? '' : this.state.status[ 0 ];
		const coordinator =
			'undefined' === typeof this.state.coordinator[ 0 ] ? '' : this.state.coordinator[ 0 ];

		const meButton =
			! currentUser || currentUser.id === coordinator ? (
				''
			) : (
				<button name="coordinator" value={ currentUser.id } onClick={ this.select }>
					Me
				</button>
			);
		const anyButton =
			coordinator !== '' ? (
				<button name="coordinator" value="" onClick={ this.select }>
					Any
				</button>
			) : null;

		return (
			<nav className="filters">
				<ul className="filters-main">
					<li>
						<label>
							Department <Jobs />
						</label>
					</li>
					<li>
						<label>
							Status{ ' ' }
							<select name="status" value={ status } onChange={ this.select }>
								<option value="">Any</option>
								<option value="active">Active</option>
								<option value="hired">Hired</option>
								<option value="rejected">Rejected</option>
							</select>
						</label>
					</li>

					<li>
						<label>
							Coordinator{ ' ' }
							<select name="coordinator" value={ coordinator } onChange={ this.select }>
								<option value="">Any</option>
								{ coordinators.map( ( { id, name } ) => (
									<option key={ id } value={ id }>
										{ name }
									</option>
								) ) }
							</select>
						</label>{ ' ' }
						{ meButton } { anyButton }
					</li>
				</ul>
				<details>
					<summary>More filters</summary>
					<ul>
						<li>
							<label>
								<input
									type="checkbox"
									name="needsAction"
									checked={ this.state.needsAction }
									onChange={ this.checkbox }
								/>{ ' ' }
								Needs Action
							</label>
						</li>

						<li>
							<label>
								<input
									type="checkbox"
									name="missingCoverLetter"
									checked={ this.state.missingCoverLetter }
									onChange={ this.checkbox }
								/>{ ' ' }
								Missing Cover Letter
							</label>
						</li>

						<li>
							<label>
								<input
									type="checkbox"
									name="missingEmailAddress"
									checked={ this.state.missingEmailAddress }
									onChange={ this.checkbox }
								/>{ ' ' }
								Missing Email Address
							</label>
						</li>

						<li>
							<label>
								<input
									type="checkbox"
									name="missingDemographics"
									checked={ this.state.missingDemographics }
									onChange={ this.checkbox }
								/>{ ' ' }
								Missing Pronouns/Region
							</label>
						</li>
					</ul>
				</details>
			</nav>
		);
	}
}
