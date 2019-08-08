import React from 'react';

export function External( { size = 18 } ) {
	return (
		<svg
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			height={ size }
			width={ size }
			x="0px"
			y="0px"
			viewBox="0 0 24 24"
			style={ { enableBackground: 'new 0 0 24 24' } }
		>
			<g id="external">
				<path d="M19,13v6c0,1.105-0.895,2-2,2H5c-1.105,0-2-0.895-2-2V7c0-1.105,0.895-2,2-2h6v2H5v12h12v-6H19z M13,3v2h4.586 l-7.793,7.793l1.414,1.414L19,6.414V11h2V3H13z" />
			</g>
		</svg>
	);
}

export function ChevronRight( { size = 18 } ) {
	return (
		<svg
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			height={ size }
			width={ size }
			x="0px"
			y="0px"
			viewBox="0 0 24 24"
			style={ { enableBackground: 'new 0 0 24 24' } }
		>
			<g id="chevron-right">
				<polygon points="10,20 18,12 10,4 8.586,5.414 15.172,12 8.586,18.586" />
			</g>
		</svg>
	);
}

export function ChevronDown( { size = 18 } ) {
	return (
		<svg
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			height={ size }
			width={ size }
			x="0px"
			y="0px"
			viewBox="0 0 24 24"
			style={ { enableBackground: 'new 0 0 24 24' } }
		>
			<g id="chevron-down">
				<polygon points="20,9 12,17 4,9 5.414,7.586 12,14.172 18.586,7.586" />
			</g>
		</svg>
	);
}
