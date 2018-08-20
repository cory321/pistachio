export const LOG_IN = 'AUTH_LOG_IN'
export const LOG_OUT = 'AUTH_LOG_OUT'

function _logOut( service ) {
	return {
		type: LOG_OUT,
		payload: { service },
	}
}

export function logIn( service, data ) {
	return {
		type: LOG_IN,
		payload: { service, data },
	}
}

export function logOut( service ) {
	switch ( service ) {
	case 'slack' :
		return ( dispatch, getState, { slack } ) => {
			const { auth } = getState()

			if ( auth.slack && auth.slack.token ) {
				slack( auth.slack.token ).auth.revoke()
			}

			dispatch( _logOut( service ) )
		}
	default :
		return _logOut( service )
	}
}
