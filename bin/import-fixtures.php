<?php

require( '../../../wp-load.php' );

if ( ! function_exists( 'wp' ) ) {
	die( 'Nope' );
}

import_fixtures();
function import_fixtures() {
	$json = json_decode( file_get_contents("candidates.json") );
	foreach( $json as $c ) {
		$post_id = wp_insert_post( [
				'post_title' => $c->name,
				'post_type' => 'candidate',
				'post_status' => 'publish',
		] );
		$result = update_post_meta( $post_id, 'json', $c );
	}
}

