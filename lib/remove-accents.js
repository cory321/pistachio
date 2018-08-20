function removeAccents( string ) {
	return [ ...( string.normalize( 'NFD' ) ) ].filter( char => char.charCodeAt() < 0x7E ).join( '' )
}

export default removeAccents
