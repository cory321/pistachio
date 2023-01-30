import { intersection } from 'lodash';

function intersectionOp( candidate, filterPath, filterValues ) {
	const candidateProp = filterPath
		.split( '|' )
		.map( path => getFilterPathFromCandidate( candidate, path ) )
		.flat();

	return intersection( candidateProp, filterValues ).length
		? intersection( candidateProp, filterValues )
		: false;
}

function anyOp( candidate, filterPath ) {
	return ! emptyOp( candidate, filterPath );
}

function emptyOp( candidate, filterPath ) {
	return ! filterPath.split( '|' ).every( path => {
		const pathResult = getFilterPathFromCandidate( candidate, path );
		return pathResult && ( ! Array.isArray( pathResult ) || pathResult.length > 0 );
	} );
}

function getFilterPathFromCandidate( candidate, filterPath ) {
	let current = candidate;
	filterPath.split( '.' ).forEach( key => {
		if ( ! current ) return null;
		current = Array.isArray( current ) ? current.map( val => val[ key ] ) : current[ key ];
	} );
	return current;
}

export function filterCandidates( filters, candidates ) {
	return candidates.filter( candidate => {
		return filters.every( filter => {
			if ( filter.type === 'candidate' ) {
				switch ( filter.op ) {
					case 'intersection':
						return intersectionOp( candidate, filter.path, filter.values );
					case 'any':
						return anyOp( candidate, filter.path, filter.values );
					case 'empty':
						return emptyOp( candidate, filter.path );
					default:
						return true;
				}
			}
		} );
	} );

	return [];
}
