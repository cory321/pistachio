import filterReducer, {
	JOBS_PATH,
	STATUS_PATH,
	MISSING_COVER_LETTER_PATH,
	MISSING_DEMOGRAPHICS_PATH,
	COORDINATOR_PATH,
} from '../filters';
import { filters as filterActions } from '../../actions';

describe( 'filter reducer', () => {
	it( 'should start with an empty array', () => {
		const state = filterReducer( undefined, { type: undefined, payload: undefined } );
		expect( state ).toEqual( [] );
	} );

	it( 'should ignore unknown actions', () => {
		const state = filterReducer( [ 1, 2, 3, 4 ], { type: 'adsf', payload: [] } );
		expect( state ).toEqual( [ 1, 2, 3, 4 ] );
	} );

	it( 'should clear all filters when running the clear action', () => {
		const state = filterReducer( [ 1, 2, 3, 4 ], filterActions.clear() );
		expect( state ).toEqual( [] );
	} );

	describe( 'jobs filter', () => {
		testAction( {
			action: filterActions.jobs,
			op: 'intersection',
			path: JOBS_PATH,
			addPayload: [ 1 ],
			addResult: [ 1 ],
			replacePayload: [ 2 ],
			replaceResult: [ 2 ],
			removePayload: [],
		} );
	} );

	describe( 'status filter', () => {
		testAction( {
			action: filterActions.status,
			op: 'intersection',
			path: STATUS_PATH,
			addPayload: [ 1 ],
			addResult: [ 1 ],
			replacePayload: [ 2 ],
			replaceResult: [ 2 ],
			removePayload: [],
		} );
	} );

	describe( 'missing cover letter filter', () => {
		testAction( {
			action: filterActions.missingCoverLetter,
			op: 'empty',
			path: MISSING_COVER_LETTER_PATH,
			addPayload: true,
			addResult: [],
			removePayload: false,
		} );
	} );

	describe.skip( 'missing resume filter', () => {} );

	describe( 'missing demographics filter', () => {
		testAction( {
			action: filterActions.missingDemographics,
			op: 'intersection',
			path: MISSING_DEMOGRAPHICS_PATH,
			addPayload: true,
			addResult: [ null ],
			removePayload: false,
		} );
	} );

	describe( 'coordinator filter', () => {
		const nonePayload = [ 0 ];
		const somebodyPayload = [ 1 ];

		describe( '"none" case', () => {
			testAction( {
				action: filterActions.coordinator,
				op: 'empty',
				path: COORDINATOR_PATH,
				addPayload: nonePayload,
				addResult: nonePayload,
				removePayload: [],
			} );
		} );

		describe( '"somebody" case', () => {
			testAction( {
				action: filterActions.coordinator,
				op: 'any',
				path: COORDINATOR_PATH,
				addPayload: somebodyPayload,
				addResult: somebodyPayload,
				removePayload: [],
			} );
		} );

		describe( 'coordinator ID case', () => {
			testAction( {
				action: filterActions.coordinator,
				op: 'intersection',
				path: COORDINATOR_PATH,
				addPayload: [ 2 ],
				addResult: [ 2 ],
				replacePayload: [ 3 ],
				replaceResult: [ 3 ],
				removePayload: [],
			} );
		} );
	} );

} );

function testAction( {
	action,
	addPayload,
	replacePayload,
	removePayload,
	op,
	path,
	addResult,
	replaceResult,
} ) {
	const addedFilter = filterReducer( [], action( addPayload ) );
	let replacedFilter;
	if ( replacePayload ) {
		replacedFilter = filterReducer( addedFilter, action( replacePayload ) );
	}
	const removedFilter = filterReducer(
		replacedFilter ? replacedFilter : addedFilter,
		action( removePayload )
	);

	it( 'should add', () => {
		expect( addedFilter ).toHaveLength( 1 );
		const filter = addedFilter[ 0 ];
		expectFilter( {
			filter,
			op: op,
			path: path,
			values: addResult,
		} );
	} );

	if ( replacedFilter ) {
		it( 'should replace', () => {
			expect( replacedFilter ).toHaveLength( 1 );
			const filter = replacedFilter[ 0 ];
			expectFilter( {
				filter,
				op: op,
				path: path,
				values: replaceResult,
			} );
		} );
	}

	it( 'should remove', () => {
		expect( removedFilter ).toHaveLength( 0 );
	} );
}

function expectFilter( { filter, op, path, values } ) {
	expect( filter.type ).toEqual( 'candidate' );
	expect( filter.op ).toEqual( op );
	expect( filter.path ).toEqual( path );
	expect( filter.values ).toEqual( values );
}
