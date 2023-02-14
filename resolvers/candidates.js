import { fetch, fetchFromAPI, addMany, success, error } from '../actions/candidates';
export function* getCandidates() {
	yield fetch();
	try {
		const candidates = yield fetchFromAPI( '/wp/v2/candidates/?per_page=300' );
		yield addMany( candidates );
		yield success( candidates );
	} catch ( err ) {
		yield error( err );
	}
	return;
}
