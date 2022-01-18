/*
 * Hover content includes elements like links or buttons shown when hovering over a row.
 * With help from the design/UX folks, we decided on these requirements for hover rows and hover content:
 * - Hover content is always and immediately shown for, and only for, the hover row over which the mouse is located
 *     with the following exceptions.
 * - After entering a section of hover rows, no new hover content in any row is shown for one second,
 *     though previous content shown on exit might still be shown per the following requirement.
 * - After spending at least one second in a section of hover rows then exiting it,
 *     any hover content shown upon exit remains shown for one second.
 * - Hover content can also be shown or hidden via button/keyboard, and
 *     once shown via button/keyboard, hover content remains shown until hidden via button/keyboard.
 */
import React, { useState } from 'react';

// Updates to lastEnter and lastLeave don't directly cause state transitions
// They don't need to be part of React state and can be set synchronously
let lastEnter = 0;
let lastLeave = 0;

export function entering() {
	return lastEnter > lastLeave;
}

export function exiting() {
	return lastLeave > lastEnter;
}

// Updates to entry/exit/mouseIsOver can cause state transitions and are part of React state
export default function HoverRow( props ) {
	const [ mouseIsOver, setMouseIsOver ] = useState( false );

	const clearEntry = () => {
		props.setEntry( count => count - 1 );
	};

	const resetEntry = () => {
		props.setEntry( count => count + 1 );
	};

	const clearExit = () => {
		props.setExit( count => count - 1 );
	};

	const resetExit = () => {
		props.setExit( count => count + 1 );
	};

	const mouseEnter = e => {
		lastEnter = e.timeStamp;
		setMouseIsOver( true );

		if ( entering() ) {
			if ( props.entry > 0 ) {
				setTimeout( resetEntry, 1000 );
			} else {
				props.setEntry( count => count + 1 );
				setTimeout( clearEntry, 1000 );
			}
		}
	};

	const mouseLeave = e => {
		lastLeave = e.timeStamp;
		setMouseIsOver( false );

		if ( exiting() ) {
			if ( props.exit > 0 ) {
				setTimeout( resetExit, 1000 );
			} else {
				props.setExit( true );
				setTimeout( clearExit, 1000 );
			}
		}
	};

	return (
		<tr onMouseEnter={ mouseEnter } onMouseLeave={ mouseLeave }>
			{ props.children.slice( 0, -1 ) }
			{ React.cloneElement( props.children[ props.children.length - 1 ], {
				mouseIsOver: mouseIsOver,
			} ) }
		</tr>
	);
}
