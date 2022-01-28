const _ = require( 'lodash' );

const { RandomCandidate } = require( './fixture-generators' );
// eslint-disable-next-line no-console
console.log( JSON.stringify( _.times( 50, RandomCandidate ), null, 2 ) );
