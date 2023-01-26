function intersectionOp( obj, pathString ) {
	const paths = pathString.split( '|' );
	return paths.map( path => getNestedValue( obj, path ) ).includes( null );
}

function anyOp( candidate, filter ) {
	return true;
}

function emptyOp( candidate, filter ) {
	return getNestedValue( candidate, filter ).length === 0;
}

function getNestedValue( obj, pathString ) {
	if ( ! pathString ) return obj;
	return pathString.split( '.' ).reduce( ( obj, prop ) => ( obj ? obj[ prop ] : undefined ), obj );
}

function regexOp( candidate, filterPath ) {
	const paths = filterPath.split( '|' ).map( path => path.split( '.' ).slice( 0, -1 ).join( '.' ) );

	const regexps = filterPath
		.split( '|' )
		.map( path => new RegExp( path.split( '/' ).slice( -2, -1 ) ) );

	return ! candidate.json.attachments
		.map( attachment => attachment.filename )
		.some( filename => regexps.some( regexp => regexp.test( filename ) ) );
}

export function filterCandidates( filters, candidates ) {
	if ( typeof candidates === 'object' ) {
		return candidates.filter( candidate => {
			return filters.every( filter => {
				if ( filter.type === 'candidate' ) {
					switch ( filter.op ) {
						case 'intersection':
							return intersectionOp( candidate, filter.path );
						case 'any':
							return anyOp( candidate, filter.path );
						case 'empty':
							return emptyOp( candidate, filter.path );
						case 'regex':
							return regexOp( candidate, filter.path );
						default:
							return true;
					}
				}
			} );
		} );
	}
	return [];
}
