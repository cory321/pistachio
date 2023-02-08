import * as actions from '../actions/candidates';
import { CANDIDATES_PATH } from '../data/constants';

export function* getCandidates() {
	try {
		const candidates = yield actions.fetchFromAPI( CANDIDATES_PATH );
		return candidates ? actions.addMany( candidates ) : candidates;
	} catch ( err ) {
		return actions.error( err );
	}
}
