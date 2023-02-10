export function getCandidates( state ) {
	return state.candidates || [];
}

export function getCandidateFetchers( state ) {
	return state.fetchers.candidates || [];
}
