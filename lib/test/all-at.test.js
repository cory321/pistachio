/** @format */

import allAt from '../all-at';
import { filterCollectionWith } from '../all-at';

describe( 'allAt', () => {
	it( 'works for a single number property', () => {
		const object = { a: 1 };
		const result = allAt( object, 'a' );
		expect( result ).toEqual( [ 1 ] );
	} );

	it( 'works for a single array property', () => {
		const object = { a: [ 1, 2 ] };
		const result = allAt( object, 'a' );
		expect( result ).toEqual( [ 1, 2 ] );
	} );

	it( 'works for a nested single property', () => {
		const object = { a: { b: 1 } };
		const result = allAt( object, 'a.b' );
		expect( result ).toEqual( [ 1 ] );
	} );

	it( 'works for a nested array property', () => {
		const object = { a: { b: [ 1, 2 ] } };
		const result = allAt( object, 'a.b' );
		expect( result ).toEqual( [ 1, 2 ] );
	} );

	it( 'works for a property with an array of objects', () => {
		const object = { a: [ { b: 1 }, { b: 2 } ] };
		const result = allAt( object, 'a.b' );
		expect( result ).toEqual( [ 1, 2 ] );
	} );

	it( 'works with multiple selectors defined with |', () => {
		const object = { a: [ { b: 1 }, { c: 2 } ] };
		const result = allAt( object, 'a.b|a.c' );
		expect( result ).toEqual( [ 1, 2 ] );
	} );

	it( 'works for triple nested arrays of objects', () => {
		const object = { a: { b: [ { c: 1 }, { c: 2 }, { c: 3 } ] } };
		const result = allAt( object, 'a.b.c' );
		expect( result ).toEqual( [ 1, 2, 3 ] );
	} );

	it( 'returns an empty array if the property is an empty array', () => {
		const object = { a: { b: [] } };
		const result = allAt( object, 'a.b' );
		expect( result ).toEqual( [] );
	} );

	it( 'returns null if the property is null', () => {
		const object = { a: { b: null } };
		const result = allAt( object, 'a.b' );
		expect( result ).toEqual( [ null ] );
	} );
} );

describe( 'filterCollectionWith', () => {
	let collection;
	let object1;
	let object2;
	let emptyObject;
	let nullObject;

	beforeEach( () => {
		object1 = { a: [ { b: 1 }, { b: 2 } ] };
		object2 = { a: [ { b: 3 }, { b: 4 } ] };
		emptyObject = { a: [ { b: [] } ] };
		nullObject = { a: [ { b: null } ] };
		collection = [ object1, object2, emptyObject, nullObject ];
	} );

	it( 'returns objects that pass the filter when the intersection op is used', () => {
		const filter = {
			path: 'a.b',
			values: [ 1 ],
			op: 'intersection',
		};
		const result = filterCollectionWith( collection, [ filter ] );
		expect( result ).toHaveLength( 1 );
		expect( result[ 0 ] ).toBe( object1 );
	} );

	it( 'returns objects that pass each filter when the intersection op is used', () => {
		const passingObject = { a: { b: [ 1, 2 ] } };
		const passingIncompleteMatch = { a: { b: [ 1 ] } };
		const failingEmpty = { a: { b: [] } };
		const failingNoMatch = { a: { b: [ 3 ] } };

		const filter = {
			path: 'a.b',
			values: [ 1, 2 ],
			op: 'intersection',
		};
		const localCollection = [ passingObject, passingIncompleteMatch, failingEmpty, failingNoMatch ];
		const result = filterCollectionWith( localCollection, [ filter ] );
		expect( result[ 0 ] ).toBe( passingObject );
		expect( result[ 1 ] ).toBe( passingIncompleteMatch );
		expect( result ).toHaveLength( 2 );
	} );

	it( 'returns all objects that are empty at the path when the empty op is used', () => {
		const filter = {
			path: 'a.b',
			values: [],
			op: 'empty',
		};
		const result = filterCollectionWith( collection, [ filter ] );
		expect( result ).toHaveLength( 1 );
		expect( result[ 0 ] ).toBe( emptyObject );
	} );

	it( 'returns all objects that are not empty at the path when the any op is used', () => {
		const filter = {
			path: 'a.b',
			values: [],
			op: 'any',
		};
		const result = filterCollectionWith( collection, [ filter ] );
		expect( result ).toHaveLength( 2 );
		expect( result[ 0 ] ).toBe( object1 );
		expect( result[ 1 ] ).toBe( object2 );
	} );

	it( 'returns all objects that pass each filter when the intersection op and multiple filters are used', () => {
		const filter1 = {
			path: 'a.b',
			values: [ 1 ],
			op: 'intersection',
		};
		const filter2 = {
			path: 'a.b',
			values: [ 2 ],
			op: 'intersection',
		};

		const result = filterCollectionWith( collection, [ filter1, filter2 ] );
		expect( result ).toHaveLength( 1 );
		expect( result[ 0 ] ).toBe( object1 );
	} );

	it( 'returns all objects that have a null if an intersection with null is used', () => {
		const fullObject = { a: { b: 1, c: 1 } };
		const emptyB = { a: { b: null, c: 1 } };
		const emptyC = { a: { b: 1, c: null } };

		const filter = {
			path: 'a.b|a.c',
			values: [ null ],
			op: 'intersection',
		};

		const result = filterCollectionWith( [ fullObject, emptyB, emptyC ], [ filter ] );
		expect( result ).toHaveLength( 2 );
		expect( result[ 0 ] ).toBe( emptyB );
		expect( result[ 1 ] ).toBe( emptyC );
	} );
} );
