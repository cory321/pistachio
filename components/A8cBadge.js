import React from 'react';

export default function A8cBadge( { emails } ) {
	if ( ! emails[ 0 ] ) {
		return null;
	}
	const isA8c = ( Array.isArray( emails ) ? emails : [ emails ] ).some( email =>
		email.includes( '@automattic.com' )
	);

	return isA8c ? <span className="a8c">A8C!</span> : null;
}
