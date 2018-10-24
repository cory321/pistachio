<?php
/**
 * Plugin Name: Pistachio
 * Plugin URI: https://github.com/automattic-hiring/pistachio
 * Description: The Pistachio Hiring dashboard. A green seed.
 * Version: 0.0.1
 * Author: Automattic
 *
 * @package pistachio
 */

/**
 * Output basic HTML for the Pistachio JavaScript app
 */
function the_pistachio_project() {
	?>
	<div id="container">
		<h1>Pistachio: The Green Nut</h1>
		<div id="pistachio"></div>
	</div>
	<?php
}

/**
 * Add a menu for the main view, and a submenu item for the Candidates Custom Post Type.
 */
function pistachio_menu() {
	add_menu_page(
		'Pistachio',
		'Pistachio',
		'edit_posts',
		'pistachio',
		'the_pistachio_project'
	);
	add_submenu_page(
		'pistachio',
		'Candidates',
		'Candidates',
		'manage_options',
		'edit.php?post_type=candidate',
		null
	);
}
add_action( 'admin_menu', 'pistachio_menu' );

/**
 * Enqueue our scripts and styles.
 */
function pistachio_enqueue() {
	// TODO: Don't load for every page.
	wp_enqueue_script( 'pistachio', plugin_dir_url( __FILE__ ) . '/dist/index.js', [ 'wp-api-fetch', 'wp-element', 'wp-core-data', 'wp-data' ] );
	// TODO: Figure out whether we want to put this through webpack or not.
	wp_enqueue_style( 'pistachio', plugin_dir_url( __FILE__ ) . '/style.css' );
}
add_action( 'admin_enqueue_scripts', 'pistachio_enqueue', 10 );

/**
 * Register the Candidate Custom Post Type.
 */
function candidate_post_type() {

	$labels = array(
		'name'           => _x( 'Candidates', 'Post Type General Name', 'pistachio' ),
		'singular_name'  => _x( 'Candidate', 'Post Type Singular Name', 'pistachio' ),
		'menu_name'      => __( 'Pistachio', 'pistachio' ),
		'name_admin_bar' => __( 'Candidates', 'pistachio' ),
		'archives'       => __( 'Candidate Archives', 'pistachio' ),
		'attributes'     => __( 'Candidate Attributes', 'pistachio' ),
		'all_items'      => __( 'All candidates', 'pistachio' ),
		'add_new'        => __( 'Add New', 'pistachio' ),
	);
	$args   = array(
		'label'               => __( 'Candidate', 'pistachio' ),
		'description'         => __( 'Greenhouse Candidate', 'pistachio' ),
		'labels'              => $labels,
		'supports'            => array( 'title' ),
		'hierarchical'        => false,
		'public'              => true,
		'publicly_queryable'  => true,
		'show_ui'             => true,
		'show_in_menu'        => false,
		'menu_position'       => 5,
		'exclude_from_search' => false,
		'searchable'          => true,
		'publicly_queryable'  => true,
		'rewrite'             => false,
		'capability_type'     => 'post',
		'show_in_rest'        => true,
		'rest_base'           => 'candidates',
	);
	register_post_type( 'candidate', $args );

	register_rest_field(
		'candidate',
		'json',
		[
			'get_callback'    =>
			function( $object = '', $field_name = '', $request = array() ) {
				return get_post_meta( $object['id'], $field_name, true );
			},
			'update_callback' =>
			function( $value, $object, $field_name ) {
				return update_post_meta( $object->ID, $field_name, $value );
			},
		]
	);

}
add_action( 'init', 'candidate_post_type' );

/**
 * Increase REST API per page value.
 *
 * @param array $params Default API paramaters.
 *
 * @return array Filtered API parameters.
 */
function change_per_page( $params ) {
	if ( isset( $params['per_page'] ) ) {
		$params['per_page']['maximum'] = 9999;
	}
	return $params;
}
add_filter( 'rest_candidate_collection_params', 'change_per_page', 10, 1 );

