/** @format */
import { Candidate } from './fixture-generators';

const candidateConfigs = require( './candidate-configs' );

function WP_Candidate( props ) {
	return {
		id: props.id,
		json: Candidate( props ),
	};
}

for ( const key of Object.keys( candidateConfigs ) ) {
	if ( Array.isArray( candidateConfigs[ key ] ) ) {
		module.exports[ key ] = candidateConfigs[ key ].map( WP_Candidate );
	} else {
		module.exports[ key ] = WP_Candidate( candidateConfigs[ key ] );
	}
}
