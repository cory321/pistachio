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

function anyOp( candidate, filterValues ) {
	return true;
}

function emptyOp( candidate, filterPath ) {
	return filterPath.split( '|' ).some( path => {
		return ! getFilterPathFromCandidate( candidate, path ).length;
	} );
}

function getFilterPathFromCandidate( candidate, filterPath ) {
	let current = candidate;
	filterPath
		.split( '.' )
		.forEach(
			key =>
				( current = Array.isArray( current ) ? current.map( val => val[ key ] ) : current[ key ] )
		);
	return current;
}

export function filterCandidates( filters, candidates ) {
	if ( typeof candidates === 'object' ) {
		return candidates.filter( candidate => {
			return filters.every( filter => {
				if ( filter.type === 'candidate' ) {
					switch ( filter.op ) {
						case 'intersection':
							return intersectionOp( candidate, filter.path, filter.values );
						case 'any':
							return anyOp( candidate, filter.path );
						case 'empty':
							return emptyOp( candidate, filter.path );
						default:
							return true;
					}
				}
			} );
		} );
	}
	return [];
}
