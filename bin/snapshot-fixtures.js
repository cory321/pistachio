/** @format */

const { Candidate } = require( './fixture-generators' );
const {
	allCandidates,
	hiredCandidates,
	rejectedCandidates,
	active_appReview_codeWrangler,
	active_appReview_javaScriptEngineer,
} = require( './candidate-configs' );

console.log( JSON.stringify( allCandidates.map( Candidate ) ) );
