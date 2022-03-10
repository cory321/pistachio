<!-- @format -->

# Pistachio

The Green Nut.

Displays Greenhouse candidates by department/job.

Displays recent Gmail messages and imports them into Greenhouse.

## Installing

1. Install the Node.js version listed in the "engines" section of package.json. We recommend using `nvm` to manage node installs. After installing `nvm`, you can run `nvm use` to set the correct node version in that terminal.
2. `yarn install` (if yarn isn't available, enter `corepack enable` in the terminal then try again)
3. `yarn start`. This will watch your filesystem for changes and recompile frontend assets if necessary. If you don't plan to work on the frontend, this step can be skipped.
4. Install `docker`
5. Run `yarn wp-env:start` and wait until it's ready. This command creates the necessary Docker containers: a fully working WordPress install on port 8082, and a database. It also creates a container for tests, but you don't need to worry about it because you won't be accessing it directly.
6. `yarn wp-env:setup`. This will finish up doing the necessary things needed to run the Pistachio plugin (like runnning composer install, activating the plugin, etc.).

## Uninstalling

If something related to the Docker setup breaks, there is an easy way to remove everything and start from scratch:

1. `yarn wp-env:destroy`. This removes the created Docker containers, volumes, and networks that were created for this setup. This is a pretty harmless thing to do because only Docker-related infrastructure is removed; all the code in the repo is left untouched.
2. `docker image prune`. This command will delete unused images that Docker regards as "dangling", which means that they are not being used by any container. This might remove images that you (or other Docker setups in your computer) might have downloaded. This is also pretty safe as any images needed by Docker will be downloaded upon request. The only downside to executing this command is having to re-download them, which can take considerable time depending on your internet connection speed.

### Notes for Windows users

The [Windows Subsystem for Linux WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10) is required for running this project on Windows, and `docker-compose` should be run in the WSL terminal.
If available, WSL 2 is recommended and shouldn't require any additional setup.

#### Running Docker in WSL 1
1. Follow the instructions in [this article](https://nickjanetakis.com/blog/setting-up-docker-for-windows-and-wsl-to-work-flawlessly) to have docker running in WSL 1.
2. When checking out this repository, make sure you do that inside the Windows filesystem (e.g. `c/Users/USERNAME/dev/pistachio-your-name`). This will ensure docker for windows has full access to it.

#### Line Endings
Make sure you have **Linux line endings** and that Git doesn't convert them. Command `git config core.autocrlf` should return `false`. Shell scripts will not work in Linux containers if you use Windows line endings!
If you already cloned repository with `autocrlf` = true, follow [this article](https://help.github.com/en/articles/dealing-with-line-endings#refreshing-a-repository-after-changing-line-endings) to change them.
Alternatively, it's easier to just:

```
rm -rf <repo>
mkdir <repo>
cd <repo>
git init
git config core.autocrlf false
git remote add origin <url>
git fetch origin
git checkout -b master --track origin/master
```

## Doing

Visit http://localhost:8082/wp-admin/admin.php?page=pistachio — you should see the UI. The username is `admin` and the password is `password`.

## Tests

We like tests :) Make sure you run them before starting out!

PHP unit tests can be run with:

`yarn test-unit-php`

JavaScript unit tests can be run with:

`yarn test-unit-js`

## Coding standards

For PHP, we use PHP Code Sniffer with the WordPress coding standards. You can run the linter
with: `yarn lint-php`. You can attempt to fix any standard violations `phpcs` finds with
`yarn lint-php:fix`.

The PHP linter runs in a Docker container, but you can always install `phpcs` with the WordPress
coding standards locally, for integration with your IDE or text editor.

For JavaScript, we use `eslint`. You can run `yarn lint-js`, or set up `eslint` to be run in your
text editor/IDE.
