const { Candidate } = require( './fixture-generators' );
const { allCandidates } = require( './candidate-configs' );
// eslint-disable-next-line no-console
console.log( JSON.stringify( allCandidates.map( Candidate ) ) );
