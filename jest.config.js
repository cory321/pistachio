module.exports = {
	clearMocks: true,
	preset: '@automattic/calypso-build',
	rootDir: __dirname,
	snapshotSerializers: [ '<rootDir>/node_modules/enzyme-to-json/serializer.js' ],
};
