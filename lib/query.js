export function queryParameterFromLabel( label ) {
	return 'label:' + label.name.toLowerCase().replace( /[^a-z0-9]+/g, '-' )
}

export function changeQueryLabels( query, labels, labelIds ) {
	const labelQueryParameters = labels
		.filter( label => labelIds.includes( label.id ) )
		.map( queryParameterFromLabel )
		.join( ' ' )

	return query.replace( /([^-]|^)\blabel:[a-z0-9-]+/g, '$1' ).replace( /\s+$/, '' ) + ' ' + labelQueryParameters
}
