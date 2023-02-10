import { fetch, test, fetchFromAPI, addMany, success, error } from '../actions/candidates';
import { CANDIDATES_PATH } from '../data/constants';

export function* getCandidates() {
	yield fetch();
	try {
		const candidates = yield fetchFromAPI( CANDIDATES_PATH );
		yield addMany( candidates );
		yield success( candidates );
	} catch ( err ) {
		yield error( err );
	}
	return;
}
