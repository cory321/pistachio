/** @format */

export const CLEAR = 'FILTER_CLEAR';
export const JOBS = 'FILTER_JOBS';
export const STATUS = 'FILTER_STATUS';
export const MISSING_COVER_LETTER = 'FILTER_MISSING_COVER_LETTER';
export const MISSING_EMAIL_ADDRESS = 'FILTER_MISSING_EMAIL_ADDRESS';
export const MISSING_DEMOGRAPHICS = 'FILTER_MISSING_DEMOGRAPHICS';
export const COORDINATOR = 'FILTER_COORDINATOR';
export const NEEDS_ACTION = 'FILTER_NEEDS_ACTION';

export function clear() {
	return {
		type: CLEAR,
	};
}

export function jobs( job_ids ) {
	return {
		type: JOBS,
		payload: job_ids,
	};
}

export function missingCoverLetter( isActive ) {
	return {
		type: MISSING_COVER_LETTER,
		payload: isActive,
	};
}

export function missingEmailAddress( isActive ) {
	return {
		type: MISSING_EMAIL_ADDRESS,
		payload: isActive,
	};
}

export function missingDemographics( isActive ) {
	return {
		type: MISSING_DEMOGRAPHICS,
		payload: isActive,
	};
}

export function status( s ) {
	return {
		type: STATUS,
		payload: s,
	};
}

export function coordinator( coordinators ) {
	return {
		type: COORDINATOR,
		payload: coordinators,
	};
}

export function needsAction( isActive ) {
	return {
		type: NEEDS_ACTION,
		payload: isActive,
	};
}
