import React, { Component } from 'react';

import { changeQueryLabels } from '../lib/query';

function groupByDepartment( labels, jobs ) {
	const noDepartment = {
		id: Infinity,
		name: 'No Department',
	};

	const departmentFromJobName = new Map();
	for ( const job of jobs ) {
		const jobName = job.name.toLowerCase();
		const department = ( job.departments && job.departments[ 0 ] ) || noDepartment;

		departmentFromJobName.set( jobName, department );
	}

	return labels.reduce(
		( groupedByDepartment, label ) => {
			const labelName = label.name.toLowerCase();

			const department = departmentFromJobName.get( labelName ) || noDepartment;

			const labels =
				( groupedByDepartment[ department.id ] && groupedByDepartment[ department.id ].labels ) ||
				[];

			return {
				...groupedByDepartment,
				[ department.id ]: {
					name: department.name,
					labels: [ ...labels, label ],
				},
			};
		},
		{
			[ noDepartment.id ]: {
				name: noDepartment.name,
				labels: [],
			},
		}
	);
}

export default class Labels extends Component {
	constructor( props ) {
		super( props );

		this.state = { currentLabel: props.queryLabelId };
		this.initialQuery = props.query;

		this.change = this.change.bind( this );
		this.refresh = this.refresh.bind( this );
		this.submitQuery = this.submitQuery.bind( this );
		this.resetQuery = this.resetQuery.bind( this );

		this.queryInput = null;
	}

	// This is ugly :(
	componentDidUpdate( prevProps ) {
		if ( prevProps.query !== this.props.query ) {
			this.queryInput.value = this.props.query;
			// If queryLabelId is undefined (falsey), don't change the currently
			// selected label in the UI/local-state
			/**
			 * TODO: Do not use setState in componentDidUpdate  react/no-did-update-set-state
			 * Commenting out this section to fix the linting error in PR#88. This component isn't
			 * currently hooked up or in use, so rather than fixing, we're removing for now.
			 *
			 * if ( this.props.queryLabelId ) {
			 *	this.setState( { currentLabel: this.props.queryLabelId } );
			 * }
			 */
		}
	}

	change( event ) {
		const currentLabel = event.target.value;

		this.setState( { currentLabel } );

		this.props.setLabels( [ currentLabel ] );
	}

	refresh() {
		this.props.refresh();
	}

	submitQuery( event ) {
		event.preventDefault();

		this.props.setQuery( this.queryInput.value );
	}

	resetQuery( event ) {
		event.preventDefault();

		// Reset the query back to the "normal" one, taking into
		// account the currently selected label
		this.props.setQuery(
			changeQueryLabels( this.initialQuery, this.props.labels, [ this.state.currentLabel ] )
		);
	}

	render() {
		const { labels, jobs, query } = this.props;
		const { currentLabel } = this.state;

		const sorted = labels
			.map( label => ( { ...label, name: label.name.replace( 'Position/', '' ) } ) )
			.sort( ( a, b ) => {
				if ( a.name < b.name ) {
					return -1;
				} else if ( a.name > b.name ) {
					return 1;
				}
				return 0;
			} );

		const groupedByDepartment = groupByDepartment( sorted, jobs );

		return (
			<ul>
				<li>
					Position{ ' ' }
					<select value={ currentLabel } onChange={ this.change }>
						{ Object.keys( groupedByDepartment ).map( departmentId => (
							<optgroup key={ departmentId } label={ groupedByDepartment[ departmentId ].name }>
								{ groupedByDepartment[ departmentId ].labels.map( label => (
									<option key={ label.id } value={ label.id }>
										{ label.name }
									</option>
								) ) }
							</optgroup>
						) ) }
					</select>{ ' ' }
					<button
						title="Use when Job or Label IDs change in lib/job-id-from-label-id.js"
						onClick={ this.refresh }
					>
						Refresh Labels
					</button>
				</li>
				<li>
					<form onSubmit={ this.submitQuery } onReset={ this.resetQuery }>
						<label>
							Search{ ' ' }
							<input type="search" defaultValue={ query } ref={ me => ( this.queryInput = me ) } />
						</label>
						<input type="submit" value="Search" />
						<input type="reset" />
					</form>
				</li>
			</ul>
		);
	}
}
