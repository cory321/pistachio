export function getCandidates( state ) {
	return state.candidates || [];
}

export function candidatesAreFetching( state ) {
	return state.fetchers.candidates || [];
}
