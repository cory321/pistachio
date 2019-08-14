import { at, toPath } from 'lodash';

/*
 * allAtt( { a: { b: [ { c: 1 }, { c: 2 }, { c: 3 } ] } }, 'a.b.c' )
 * [ 1, 2, 3 ]
 */
export default function allAt( object, path ) {
	if ( path.includes( '|' ) ) {
		return [].concat( ...path.split( '|' ).map( orPath => allAt( object, orPath ) ) );
	}

	const thePath = toPath( path );

	if ( '/' === thePath[ 0 ].slice( 0, 1 ) ) {
		const matcher = new RegExp( thePath[ 0 ].slice( 1, -1 ) );
		if ( matcher.exec( object ) ) {
			return [ object ];
		}

		return [];
	}

	let theAt = at( object, thePath[ 0 ] )[ 0 ];

	if ( undefined === theAt ) {
		return [];
	}

	theAt = Array.isArray( theAt ) ? theAt : [ theAt ];

	if ( thePath.length < 2 ) {
		return theAt;
	}

	return [].concat( ...theAt.map( leafier => allAt( leafier, thePath.slice( 1 ) ) ) );
}

export function filterCollectionWith( collection, filters ) {
	return collection.filter( item => {
		return filters.every( ( { path, values, op } ) => {
			const itemValues = allAt( item, path );

			switch ( op ) {
				case 'intersection':
					return values.some( value => itemValues.includes( value ) );
				case 'empty':
					return 0 === itemValues.length;
				case 'any':
					return itemValues.some( x => x );
			}
		} );
	} );
}
