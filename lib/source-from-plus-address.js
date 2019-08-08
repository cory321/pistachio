export default function sourceFromPlusAddress( plusAddress ) {
	let source;
	switch ( plusAddress ) {
		// Just an example
		case 'android-weekly':
			source = {
				name: 'Android Weekly',
				// https://app.greenhouse.io/configure/custom/options/sources
				// Get data-item-id attribute from TR element :(
				id: 139761,
			};
			break;
		default:
			source = {
				name: '',
				id: 0,
			};
	}

	return {
		...source,
		name: source.name
			? `${ source.name } <jobs+${ plusAddress }@automattic.com>`
			: `jobs+${ plusAddress }@automattic.com`,
	};
}
