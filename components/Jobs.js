import React, { Component } from 'react';

function departmentsFromJobs( jobs ) {
	return jobs.reduce( ( departments, job ) => {
		const department = ( job.departments.length && job.departments[ 0 ] ) || {
			id: 0,
			name: 'No Department',
		};

		return {
			...departments,
			[ department.id ]: {
				name: department.name,
				jobs: [
					...( ( departments[ department.id ] && departments[ department.id ].jobs ) || [] ),
					job,
				],
			},
		};
	}, {} );
}

function filterNameFromFilter( departments, filter ) {
	switch ( filter.length ) {
		case 0:
			return 'all';
		case 1:
			return 'job:' + filter[ 0 ];
		default:
			return (
				'department:' +
				Object.keys( departments ).filter( id =>
					filter.some( filter => departments[ id ].jobs.map( job => job.id ).includes( filter ) )
				)[ 0 ]
			);
	}
}

export default class Jobs extends Component {
	constructor( props ) {
		super( props );

		this.filter = this.filter.bind( this );

		const departments = departmentsFromJobs( this.props.jobs );
		this.state = {
			departments,
			currentFilterName: filterNameFromFilter( departments, this.props.currentFilter ),
		};
	}

	UNSAFE_componentWillReceiveProps( nextProps ) {
		const departments = departmentsFromJobs( nextProps.jobs );
		this.setState( {
			departments,
			currentFilterName: filterNameFromFilter( departments, nextProps.currentFilter ),
		} );
	}

	filter( event ) {
		this.setState( {
			currentFilterName: event.target.value,
		} );

		const value = event.target.value.split( ':' );
		const type = value[ 0 ];
		const id = parseInt( value[ 1 ], 10 );

		let jobIds;
		switch ( type ) {
			case 'department':
				jobIds = this.state.departments[ id ].jobs.map( job => job.id );
				break;
			case 'job':
				jobIds = [ id ];
				break;
			default:
				jobIds = [];
		}

		this.props.filter( jobIds );
	}

	render() {
		const { departments } = this.state;

		return (
			<select value={ this.state.currentFilterName } onChange={ this.filter }>
				{ [
					<option key="all" value="all">
						All
					</option>,
				].concat(
					Object.keys( departments ).map( id =>
						[
							<option key="department" value={ 'department:' + id }>
								{ departments[ id ].name }
							</option>,
						].concat(
							departments[ id ].jobs.map( job => (
								<option key={ job.id } value={ 'job:' + job.id }>
									{ '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0' + job.name }
								</option>
							) )
						)
					)
				) }
			</select>
		);
	}
}
