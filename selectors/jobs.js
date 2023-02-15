export function getJobs( state ) {
	return state.jobs || [];
}

export function isFetchingJobs( state ) {
	return state.fetchers.jobs || [];
}
