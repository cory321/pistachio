cli()
{
	docker run -it --rm --user xfs --volumes-from pistachio_wordpress --network container:pistachio_wordpress wordpress:cli "$@"
}

echo "Deleting existing candidates..."
cli wp post delete $(cli wp post list --post_type='candidate' --format=ids) > /dev/null

echo "Importing candidates..."
cli sh -c 'cd /var/www/html/wp-content/plugins/pistachio && php bin/import-fixtures.php'

echo "Done!"