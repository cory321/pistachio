/** @format */

const _ = require( 'lodash' );

const { RandomCandidate } = require( './fixture-generators' );

console.log( JSON.stringify( _.times( 50, RandomCandidate ), null, 2 ) );
