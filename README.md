<!-- @format -->

# Pistachio

The Green Nut.

Displays Greenhouse candidates by department/job.

Displays recent Gmail messages and imports them into Greenhouse.

## Installing

1. Install the Node.js version listed in the "engines" section of package.json
2. `npm install`
3. `npm start`
4. Install `docker`
5. Run `docker-compose up` and wait until it's ready
6. `bin/setup.sh`

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

Visit http://localhost:8082/wp-admin/admin.php?page=pistachio — you should see the UI.

## Tests

We like tests :) Make sure you run them before starting out!

PHP unit tests can be run with:

`npm run test-unit-php`, before you do this you should run the Docker containers in
which these tests will be run in, by using: `npm run test-unit-php:run-docker`. You'll likely have
to run `npm run test-unit-php:setup` the very first time as well, to set up some test instrumentation.

JavaScript unit tests can be run with:

`npm run test-unit-js`

## Coding standards

For PHP, we use PHP Code Sniffer with the WordPress coding standards. You can run the linter
with: `npm run lint-php`. You can attempt to fix any standard violations `phpcs` finds with
`npm run lint-php:fix`.

The PHP linter runs in a Docker container, but you can always install `phpcs` with the WordPress
coding standards locally, for integration with your IDE or text editor.

For JavaScript, we use `eslint`. You can run `npm run lint-js`, or set up `eslint` to be run in your
text editor/IDE.
