= The Agriculture Core

_The Agriculture Core_ is a NodeJS server exposing a robust REST API for various client applications to connect to.

== Configuration

The agriculture-core pulls its configuration from a `.env` file at the root of the project.
These configuration variables are loaded into `process.env.<VAR_NAME>` and are accessible accross the application.
To get started, this configuration file must be created with the following format:

[source,properties]
----
# Application Configuration
PORT=

# Database Environment
DB_HOST=
DB_NAME=
DB_USER=
DB_PASS=

# Authentication
JWT_SECRET=
JWT_ISSUER=
JWT_AUDIENCE=
JWT_EXPIRES=
----

== Development

=== Dependencies

* link:https://nodejs.org/en/[NodeJS] is the framework in use.
* MySQL server our some other valid host indicated by the `.env` file.
* link:https://yarnpkg.com/lang/en/docs/install/[yarn] handles all other dependencies.

To install all other dependencies with use the command `yarn`.

=== Building

IMPORTANT: `npm start` runs a file watcher already, no other build steps are required

To build and run for production run:

	npm run start:prod

To just build for production run:

	npm run build

An equivalent explicit command is also available:

	npm run build:prod

To build and run for development:

	npm run build:dev

To just watch the changes and build them when they change (for development), use:

	npm run watch

`npm start` already performs this so it's not necessary to run both.

==== Testing

=== Naming Conventions

Creating a new test file is easy!
You can add your unit tests in `<ROOT>/test/unit` and integration tests in `<ROOT>/test/integration`.
Just make sure your files end with `.test.ts` so they will be picked up in the webpack build.

Unit tests go in `agriculture-core/test/unit/`.
Integration tests go in `agriculture-core/test/integration`.
To ensure the files are discovered by the webpack build, test files must have the suffix `.test.ts`.

=== Running Test

To run the tests:

	npm test

This builds for production and runs all tests; including both integration and unit tests.

To skip the build step and just run the tests:

	npm run test:core

NOTE: It may be helpful/faster to keep the webpack watcher running in the background (using `npm run watch`) so the tests automatically build.

=== Running only Unit or Integration Test

To run just the unit tests:

	npm run test:unit

To run just the integration tests:

	npm run test:integration

NOTE: Neither of these commands perform a build before running

=== Custom Test Filters

Each test has a series of descriptors before the actual test.
These can be used to run only specific tests.

For example, The `@slow` tag has been added to the descriptors of tests that take a while to complete.
To run just the slow tests:

	npm run test:core -- --grep @slow

To skip the slow tests:

	npm run test:core -- --grep @slow --invert

Custom tags can be added to the tests for filtering in the future.
