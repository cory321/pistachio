/*
 * Node.js btoa()
 */
function btoa( string ) {
	return Buffer.from( string ).toString( 'base64' )
}

module.exports = btoa
