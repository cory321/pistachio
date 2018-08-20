export const CHANGE = 'ROUTE_CHANGE'

export function change( route ) {
	return {
		type: CHANGE,
		payload: route,
	}
}
