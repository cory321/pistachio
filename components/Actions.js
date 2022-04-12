import React, { useState } from 'react';
import { exiting } from './HoverRow';

function add( candidate, text ) {
	return (
		<a href={ `https://app.greenhouse.io/people/${ candidate.id }#candidate_details` }>{ text }</a>
	);
}

export default function Actions( props ) {
	const [ showActions, setShowActions ] = useState( false );
	const [ showClicked, setShowClicked ] = useState( false );

	const actions = [
		<span>
			Update
			<br />
			Status
		</span>,
		<span>
			Get
			<br />
			Resume
		</span>,
		<span>
			Get
			<br />
			Cover
		</span>,
		<span>
			Delete
			<br />
			Candidate
		</span>,
	];

	const actionsVisible = showActions || ( props.mouseIsOver && props.entry === 0 );

	const actionStyle = {
		visibility: actionsVisible ? 'visible' : 'hidden',
		opacity: actionsVisible ? '1' : '0',
		transition: 'opacity 0.01s visibility 0.01s',
		transitionDelay: exiting() && ! showClicked ? '1s' : '0s',
	};

	const actionCells = actions.map( ( a, i ) => (
		<li
			key={ `action-${ props.candidate.id }-${ i }` }
			className="actions-item"
			style={ { border: 'none', boxShadow: 'none' } }
		>
			{ add( props.candidate, a ) }
		</li>
	) );

	const toggleShow = () => {
		setShowActions( ! showActions );
		// Show/Hide actions immediately, overriding transitionDelay if needed
		setShowClicked( true );
		setTimeout( () => setShowClicked( false ), 50 );
	};

	const threeDots = (
		<svg
			width="24"
			height="24"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			role="img"
			aria-hidden="true"
			focusable="false"
		>
			<path d="M13 19h-2v-2h2v2zm0-6h-2v-2h2v2zm0-6h-2V5h2v2z"></path>
		</svg>
	);

	const showButton = (
		<button
			className={ showActions ? 'button button--active' : 'button' }
			onClick={ toggleShow }
			aria-label={ showActions ? 'Hide Actions' : 'Show Actions' }
		>
			{ threeDots }
		</button>
	);

	const actionsTable = (
		<table className="actions-table">
			<tbody>
				<tr>
					<td>
						{ showButton }
						<ul className="actions-list" style={ actionStyle }>
							{ actionCells }
						</ul>
					</td>
				</tr>
			</tbody>
		</table>
	);

	return <td>{ actionsTable }</td>;
}
