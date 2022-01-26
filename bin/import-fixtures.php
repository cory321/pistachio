<?php
/**
 * Imports fixture data into WordPress database
 *
 * @package pistachio
 */

/**
 * Attempt to load WordPress.
 */
require '../../../wp-load.php';

if ( ! function_exists( 'wp' ) ) {
	die( 'Nope' );
}

/**
 * Import candidates from candidates.json.
 *
 * To regenerate candidates.json, use `node bin/greenhouse-fixtures > candidates.json`
 */
function import_fixtures() {
	$json = json_decode( file_get_contents( 'candidates.json' ) );
	foreach ( $json as $c ) {
		$post_id = wp_insert_post(
			[
				'post_title'  => $c->name,
				'post_type'   => 'candidate',
				'post_status' => 'publish',
			]
		);
		$result  = update_post_meta( $post_id, 'json', $c );
	}
}

/**
 * Deletes all candidates.
 */
function delete_all_candidates() {
	$candidate_ids = get_posts(
		[
			'post_type'      => 'candidate',
			'post_status'    => 'any',
			'fields'         => 'ids',
			'posts_per_page' => -1,
		]
	);

	foreach ( $candidate_ids as $candidate_id ) {
		wp_delete_post( $candidate_id, true );
	}
}


if ( in_array( '--reset', $argv, true ) ) {
	delete_all_candidates();
}

import_fixtures();
