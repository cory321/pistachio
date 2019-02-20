<?php
/**
 * Google Mail service definition for the Keyring plugin.
 *
 * @package pistachio
 */
/**
 * Google (MAIL) service definition for Keyring.
 * Gmail API: https://developers.google.com/gmail/api/v1/reference/
 * OAuth implementation: https://developers.google.com/accounts/docs/OAuth2WebServer
 * App registration: https://code.google.com/apis/console/
 */
class Keyring_Service_GoogleMail extends Keyring_Service_OAuth2 {
	const NAME        = 'google-mail';
	const LABEL       = 'Google Mail';
	const SCOPE       = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.profile';
	const API_VERSION = '3.0';
	/**
	 * Request URL
	 *
	 * @var string $self_url
	 */
	var $self_url = '';
	/**
	 * Request method
	 *
	 * @var string $self_method
	 */
	var $self_method = '';
	/**
	 * Keyring_Service_GoogleMail constructor.
	 */
	function __construct() {
		parent::__construct();
		// Enable "basic" UI for entering key/secret.
		if ( ! KEYRING__HEADLESS_MODE ) {
			add_action( 'keyring_google-mail_manage_ui', array( $this, 'basic_ui' ) );
			add_filter( 'keyring_google-mail_basic_ui_intro', array( $this, 'basic_ui_intro' ) );
		}
		// Set scope.
		add_filter( 'keyring_google-mail_request_token_params', array( $this, 'request_token_params' ) );
		// Handle Google's annoying limitation of not allowing us to redirect to a dynamic URL.
		add_action( 'pre_keyring_google-mail_verify', array( $this, 'redirect_incoming_verify' ) );
		$this->set_endpoint( 'authorize', 'https://accounts.google.com/o/oauth2/auth', 'GET' );
		$this->set_endpoint( 'access_token', 'https://accounts.google.com/o/oauth2/token', 'POST' );
		$this->set_endpoint( 'self', 'https://www.googleapis.com/oauth2/v1/userinfo', 'GET' );
		$creds              = $this->get_credentials();
		$this->redirect_uri = $creds['redirect_uri'];
		$this->key          = $creds['key'];
		$this->secret       = $creds['secret'];
		$this->authorization_header    = 'Bearer';
		$this->authorization_parameter = false;
		// Need to reset the callback because Google is very strict about where it sends people.
		if ( ! empty( $creds['redirect_uri'] ) ) {
			$this->callback_url = $creds['redirect_uri']; // Allow user to manually enter a redirect URI.
		} else {
			$this->callback_url = remove_query_arg( array( 'nonce', 'kr_nonce' ), $this->callback_url ); // At least strip nonces, since you can't save them in your app config.
		}
	}
	/**
	 * Instructions for creating the credentials for Google API.
	 */
	function basic_ui_intro() {
		/* translators: %s: URL of the Google Console Dashboard */
		echo '<p>' . sprintf( __( "Google controls access to all of their APIs through their API Console. <a href='%s'>Go to the console</a> and click the project dropdown just under the logo in the upper left of the screen. Click <strong>IAM & admin</strong> and then <strong>IAM</strong> to create a new project. Click <strong>Create</strong>, enter a name and then click <strong>Create</strong> to finish. On the following page <strong>Permissions for project</strong>, simply make sure that the email account is listed down below. If it isn't, click the <strong>Add</strong> button at the top, and add it.", 'pistachio' ), 'https://console.cloud.google.com/home/dashboard' ) . '</p>';
		echo '<p>' . __( 'Now you need enable the Gmail API.', 'pistachio' ) . '</p>';
		echo '<ol>';
		echo '<li>' . __( 'Click <strong>APIs & Services</strong> in the menu on the left', 'pistachio' ) . '</li>';
		echo '<li>' . __( 'Click <strong>Enable APIs and Services</strong>', 'pistachio' ) . '</li>';
		echo '<li>' . __( 'Search for <strong>Gmail API</strong>, and click <strong>Enable</strong>', 'pistachio' ) . '</li>';
		echo '</ol>';
		echo '<p>' . __( 'Next, you need to create the Credentials, in four simple steps.', 'pistachio' ) . '</p>';
		echo '<p>' . __( 'Step 1, <strong>Find out what kind of credentials you need</strong>', 'pistachio' ) . '</p>';
		echo '<ol>';
		echo '<li>' . __( 'Click <strong>Create Credentials</strong>', 'pistachio' ) . '</li>';
		echo '<li>' . __( 'For <strong>Which API are you using?</strong>, chose <strong>Gmail</strong>', 'pistachio' ) . '</li>';
		echo '<li>' . __( 'For <strong>Where will you be calling the API from?</strong>, chose <strong>Web server</strong>', 'pistachio' ) . '</li>';
		echo '<li>' . __( 'For <strong>What data will you be accessing?</strong>, select <strong>User data</strong>', 'pistachio' ) . '</li>';
		echo '<li>' . __( 'Click the <strong>What credentials do I need?</strong> button', 'pistachio' ) . '</li>';
		echo '</ol>';
		echo '<p>' . __( 'Step 2, <strong>Create an OAuth 2.0 client ID</strong>', 'pistachio' ) . '</p>';
		echo '<ol>';
		echo '<li>' . __( "Enter a client's <strong>Name</strong>", 'pistachio' ) . '</li>';
		/* translators: %s: the Authorized JavaScript Origins for the Google API */
		echo '<li>' . sprintf( __( 'For the <strong>Authorized JavaScript Origins</strong>, enter the URL of your domain, e.g. <code>http://%s</code>', 'pistachio' ), $_SERVER['HTTP_HOST'] ) . '</li>';
		/* translators: %s: the Authorized Redirect URL for the Google API */
		echo '<li>' . sprintf( __( 'In the <strong>Authorized Redirect URIs</strong> box, enter the URL <code>%s</code>', 'pistachio' ), Keyring_Util::admin_url( $this->get_name(), array( 'action' => 'verify' ) ) ) . '</li>';
		echo '<li>' . __( "Click <strong>Create client ID</strong> when you're done", 'pistachio' ) . '</li>';
		echo '</ol>';
		echo '<p>' . __( 'Step 3, <strong>Set up the OAuth 2.0 consent screen</strong>', 'pistachio' ) . '</p>';
		echo '<ol>';
		echo '<li>' . __( 'Select the <strong>Email address</strong>', 'pistachio' ) . '</li>';
		echo '<li>' . __( 'Enter the <strong>Product name shown to users</strong>', 'pistachio' ) . '</li>';
		echo '<li>' . __( 'Click <strong>Continue</strong>', 'pistachio' ) . '</li>';
		echo '</ol>';
		echo '<p>' . __( 'Step 4, <strong>Download the credentials</strong>', 'pistachio' ) . '</p>';
		echo '<p>' . __( "Once you've saved your details, copy the <strong>Client ID</strong> into the <strong>Client ID</strong> field below, and the <strong>Client secret</strong> value into <strong>Client Secret</strong>. The Redirect URI box should fill itself out for you.", 'pistachio' ) . '</p>';
	}
	/**
	 * Get service credentials.
	 *
	 * @return array|null
	 */
	function _get_credentials() {
		if (
			defined( 'KEYRING__GOOGLEMAIL_KEY' )
			&&
			defined( 'KEYRING__GOOGLEMAIL_SECRET' )
		) {
			return array(
				'redirect_uri' => defined( 'KEYRING__GOOGLEMAIL_URI' ) ? constant( 'KEYRING__GOOGLEMAIL_URI' ) : '', // optional.
				'key'          => constant( 'KEYRING__GOOGLEMAIL_KEY' ),
				'secret'       => constant( 'KEYRING__GOOGLEMAIL_SECRET' ),
			);
		} else {
			return null;
		}
	}
	/**
	 * Set request token parameters.
	 *
	 * @param array $params Request params.
	 *
	 * @return array
	 */
	function request_token_params( $params ) {
		$params['scope']       = self::SCOPE;
		return $params;
	}
	/**
	 * Redirect to the Keyring admin UI
	 *
	 * @param array $request Request params.
	 */
	function redirect_incoming_verify( $request ) {
		if ( ! isset( $request['kr_nonce'] ) ) {
			// First request, from Google. Nonce it and move on.
			$kr_nonce = wp_create_nonce( 'keyring-verify' );
			$nonce    = wp_create_nonce( 'keyring-verify-' . $this->get_name() );
			wp_safe_redirect(
				Keyring_Util::admin_url(
					$this->get_name(),
					array(
						'action'   => 'verify',
						'kr_nonce' => $kr_nonce,
						'nonce'    => $nonce,
						'state'    => $request['state'],
						'code'     => $request['code'], // Auth code from successful response (maybe).
					)
				)
			);
			exit;
		}
	}
	/**
	 * Get an array of meta data to store with this token, based on parsing the access token
	 * details passed back from the remote service.
	 *
	 * @param Mixed $token OAuth Access Token.
	 * @return Array containing keyed values to store along with this token.
	 */
	function build_token_meta( $token ) {
		$meta = array();
		if ( ! $token ) {
			return $meta;
		}
		$token = new Keyring_Access_Token( $this->get_name(), new OAuthToken( $token['access_token'], '' ), array() );
		$this->set_token( $token );
		$response = $this->request( $this->self_url, array( 'method' => $this->self_method ) );
		if ( ! Keyring_Util::is_error( $response ) ) {
			$meta = array(
				'user_id' => $response->id,
				'name'    => $response->name,
				'profile' => $response->link,
				'picture' => $response->picture,
			);
		}
		return apply_filters( 'keyring_access_token_meta', $meta, $this->get_name(), $token, $response, $this );
	}
	/**
	 * Get a displayable string for the passed token, for this service
	 *
	 * @param \Keyring_Access_Token $token Keyring_Access_Token object.
	 * @return String for display, describing $token.
	 */
	function get_display( Keyring_Access_Token $token ) {
		return $token->get_meta( 'name' );
	}
	/**
	 * Makes the request
	 *
	 * @param string $url Request URL.
	 * @param array  $params Request params.
	 *
	 * @return array|Keyring_Error|mixed|object|String Response.
	 */
	function request( $url, array $params = array() ) {
		// add header (version), required for all requests.
		$params['headers']['GData-Version'] = self::API_VERSION;
		return parent::request( $url, $params );
	}
	/**
	 * Minor modifications from Keyring_Service::basic_ui.
	 */
	function basic_ui() {
		if ( ! isset( $_REQUEST['nonce'] ) || ! wp_verify_nonce( $_REQUEST['nonce'], 'keyring-manage-' . $this->get_name() ) ) {
			Keyring::error( __( 'Invalid/missing management nonce.', 'pistachio' ) );
			exit;
		}
		// Common Header.
		echo '<div class="wrap">';
		echo '<h2>' . __( 'Keyring Service Management', 'pistachio' ) . '</h2>';
		echo '<p><a href="' . Keyring_Util::admin_url( false, array( 'action' => 'services' ) ) . '">' . __( '&larr; Back', 'pistachio' ) . '</a></p>';
		/* translators: %s: Displayable service label */
		echo '<h3>' . sprintf( __( '%s API Credentials', 'pistachio' ), esc_html( $this->get_label() ) ) . '</h3>';
		// Handle actually saving credentials.
		if ( isset( $_POST['api_key'] ) && isset( $_POST['api_secret'] ) ) {
			// Store credentials against this service.
			$this->update_credentials(
				array(
					'key'          => stripslashes( $_POST['api_key'] ),
					'secret'       => stripslashes( $_POST['api_secret'] ),
					'redirect_uri' => stripslashes( $_POST['redirect_uri'] ),
				)
			);
			echo '<div class="updated"><p>' . __( 'Credentials saved.', 'pistachio' ) . '</p></div>';
		}
		$api_key      = '';
		$api_secret   = '';
		$redirect_uri = '';
		$creds        = $this->get_credentials();
		if ( $creds ) {
			$api_key      = $creds['key'];
			$api_secret   = $creds['secret'];
			$redirect_uri = $creds['redirect_uri'];
		}
		echo apply_filters( 'keyring_' . $this->get_name() . '_basic_ui_intro', '' );
		if ( ! $redirect_uri ) {
			$redirect_uri = Keyring_Util::admin_url( $this->get_name(), array( 'action' => 'verify' ) );
		}
		// Output basic form for collecting key/secret.
		echo '<form method="post" action="">';
		echo '<input type="hidden" name="service" value="' . esc_attr( $this->get_name() ) . '" />';
		echo '<input type="hidden" name="action" value="manage" />';
		wp_nonce_field( 'keyring-manage', 'kr_nonce', false );
		wp_nonce_field( 'keyring-manage-' . $this->get_name(), 'nonce', false );
		echo '<table class="form-table">';
		echo '<tr><th scope="row">' . __( 'Client ID', 'pistachio' ) . '</th>';
		echo '<td><input type="text" name="api_key" value="' . esc_attr( $api_key ) . '" id="api_key" class="regular-text"></td></tr>';
		echo '<tr><th scope="row">' . __( 'Client Secret', 'pistachio' ) . '</th>';
		echo '<td><input type="text" name="api_secret" value="' . esc_attr( $api_secret ) . '" id="api_secret" class="regular-text"></td></tr>';
		echo '<tr><th scope="row">' . __( 'Redirect URI', 'pistachio' ) . '</th>';
		echo '<td><input type="text" name="redirect_uri" value="' . esc_attr( $redirect_uri ) . '" id="redirect_uri" class="regular-text"></td></tr>';
		echo '</table>';
		echo '<p class="submitbox">';
		echo '<input type="submit" name="submit" value="' . __( 'Save Changes', 'pistachio' ) . '" id="submit" class="button-primary">';
		echo '<a href="' . esc_url( $_SERVER['HTTP_REFERER'] ) . '" class="submitdelete" style="margin-left:2em;">' . __( 'Cancel', 'pistachio' ) . '</a>';
		echo '</p>';
		echo '</form>';
		echo '</div>';
	}
	/**
	 * A basic test that can confirm if a token is working via the Admin UI.
	 *
	 * @return array|bool|Keyring_Error|mixed|object|String
	 */
	function test_connection() {
		$res = $this->request( $this->self_url, array( 'method' => $this->self_method ) );
		if ( ! Keyring_Util::is_error( $res ) ) {
			return true;
		}
		return $res;
	}
}
add_action( 'keyring_load_services', array( 'Keyring_Service_GoogleMail', 'init' ) );
