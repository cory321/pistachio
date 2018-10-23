/** @format */

const map = new Map( [
	[ 'Label_1', 1 ], // JavaScript Engineer
	[ 'Label_2', 2 ], // Code Wrangler
] );

export default function jobIdfromLabelId( labelId ) {
	return map.get( labelId );
}
