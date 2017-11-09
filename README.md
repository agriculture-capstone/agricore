# The Agriculture Core

_The Agriculture Core_ is a NodeJS server exposing a robust REST API allowing us to build clients on top of it.

# Description

TODO: Write description

# Development

Let's get you all setup and ready to go with _The Agriculture Core_!

## Configuration
The agriculture-core pulls its configuration from a `.env` file at the root of the project. These configuration variables are loaded into `process.env.<VAR_NAME>` and are accessible accross the application. To get started, you will have to create this configuration file using the following format:

```
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
```

## Dependencies

Well of course you need Node! You can get this [here](https://nodejs.org/en/)!

We highly recommend using Yarn for dependencies (instead of npm), due to it's ability to track and lock down all dependencies. This can be found [here](https://yarnpkg.com/lang/en/docs/install/)

You are also going to need to run a MySQL server on your machine, or point to a valid host in your `.env` file.

You're also going to need to install the npm packages, this can be done with the command:

`yarn`

And then to get started it's simply an npm script:

`npm start`

## Building

**Important Note**: `npm start` does run a file watcher already, so no build steps are required by you :smile:

To build and run for production simply run:

`npm run start:prod`

And to merely build for production run:

`npm run build` or `npm run build:prod`

If instead you're building for development, instead run:

`npm run build:dev`

If you would prefer to just watch the changes and build them when they change (for development), you can run the following:

`npm run watch`

Although again, `npm start` does already perform this for you.

## Testing

### Naming Conventions

Creating a new test file is easy! You can add your unit tests in `<ROOT>/test/unit` and integration tests in `<ROOT>/test/integration`. Just make sure your files end with `.test.ts` so they will be picked up in the webpack build.

### test

Testing is as easy as 1...2...3!

`npm test`

This will build for production and run all tests, integration and unit tests.

### test:core

If you want to skip the build step and just run all the tests, simply run:

`npm run test:core`

**Note** It may be helpful/faster to keep the webpack watcher running in the background so your tests automatically build! (ie `npm run watch`) :octocat:

### test:unit & test:integration

To test just the unit tests or just the integration tests:

`npm run test:unit` or `npm run test:integration` respectively

Be aware that neither of these is performing a build before running

### Custom test filters

Each test has a series of descriptors before the actual test. I have added the `@slow` tag to the descriptors of tests that take a while to complete. This way if you want to only run the slow tests, you can do this with the following:

`npm run test:core -- --grep @slow`

Likewise, if you want to skip the slow tests, you can run the following:

`npm run test:core -- --grep @slow --invert`

Go ahead, try adding your own tags to your tests so you can filter them the same way!

## Using Docker

The `./dockerize.sh` script can be used with the following arguments:
- `init` - creates a Docker image based on the Dockerfile
- `build` - installs the node modules and build the project using `npm run build`
- `run` - installs the node modules and starts the node server which listens on the specified port
