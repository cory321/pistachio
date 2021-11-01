import React, { useState } from 'react';
import { exiting } from './HoverRow';

function add( candidate, text ) {
	return <a href={ `https://app.greenhouse.io/people/${ candidate.id }#candidate_details` }>{text}</a>;
}

export default function Actions( props ) {
	const [showActions, setShowActions] = useState( false );
	const [showClicked, setShowClicked] = useState( false );

	const actions = [
		<span>Update<br/>Status</span>,
		<span>Get<br/>Resume</span>,
		<span>Get<br/>Cover</span>,
		<span>Delete<br/>Candidate</span>
	];

	const actionsVisible = showActions || ( props.mouseIsOver && ( props.entry == 0 ) );

	const actionStyle = {
		visibility: actionsVisible ? 'visible' : 'hidden',
		opacity: actionsVisible ? '1' : '0',
		transition: 'opacity 0.01s visibility 0.01s',
		transitionDelay: exiting() && !showClicked ? '1s' : '0s',
	};

	const actionCells = actions.map( ( a, i ) =>
		<td key={`action-${ props.candidate.id }-${ i }`} style={ { border: 'none' } }>
			<span style={ actionStyle }>
				{ add( props.candidate, a ) }
			</span>
		</td>
	);

	const toggleShow = () => {
		setShowActions( !showActions );
		// Show/Hide actions immediately, overriding transitionDelay if needed
		setShowClicked( true );
		setTimeout( () => setShowClicked( false ), 50 );
	}
	const showButton = ( <button onClick={ toggleShow }> { showActions ? '< Hide' : 'Show >' } </button> );

	const actionsTable = (
		<table style={ { borderCollapse: 'collapse', border: 'none', width: '100%', } }>
			<tbody>
				<tr>
					<td style={ { border: 'none' } }>{ showButton }</td>
					{ actionCells }
				</tr>
			</tbody>
		</table>
	);

	return ( <td  style={ { width: '280px' } }>{ actionsTable }</td> );
}
