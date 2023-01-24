export function getNestedValues( obj, pathString ) {
	if ( ! pathString ) return obj;
	const props = pathString.split( '|' );
	let result;
	const results = [];
	props.every( prop => {
		const pathProps = prop.split( '.' );
		result = pathProps.reduce( ( obj, prop ) => ( obj ? obj[ prop ] : undefined ), obj );
		if ( result !== undefined ) {
			results.push( result );
		}
		return results;
	} );
	return results;
}

export function filterCandidates( filters, candidates ) {
	return candidates.filter( candidate => {
		return filters.every( filter => {
			if ( filter.type === 'candidate' ) {
				switch ( filter.op ) {
					case 'intersection':
						return getNestedValues( candidate, filter.path ).includes( null );
					case 'empty':
						return true;
					case 'any':
						return true;
					default:
						return true;
				}
			}
		} );
	} );
}
