export function getGreenhouseAuth( state ) {
	return state.auth.greenhouse || [];
}

export function getGreenhouseAuthId( state ) {
	return state.auth.greenhouse.id || [];
}
