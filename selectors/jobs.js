export function getJobs( state ) {
	return state.jobs || [];
}

export function jobsAreFetching( state ) {
	return state.fetchers.jobs || [];
}
