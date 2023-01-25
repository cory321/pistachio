function intersectionOperation( obj, pathString ) {
	const paths = pathString.split( '|' );
	return paths.map( path => getNestedValue( obj, path ) );
}

function getNestedValue( obj, pathString ) {
	if ( ! pathString ) return obj;
	return pathString.split( '.' ).reduce( ( obj, prop ) => ( obj ? obj[ prop ] : undefined ), obj );
}

export function filterCandidates( filters, candidates ) {
	if ( typeof candidates === 'object' ) {
		return candidates.filter( candidate => {
			return filters.every( filter => {
				if ( filter.type === 'candidate' ) {
					switch ( filter.op ) {
						case 'intersection':
							return intersectionOperation( candidate, filter.path ).includes( null );
						case 'empty':
							return getNestedValue( candidate, filter.path ).length === 0;
						case 'any':
							return true;
						default:
							return true;
					}
				}
			} );
		} );
	}
	return [];
}
