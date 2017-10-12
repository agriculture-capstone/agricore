# The Agriculture Core

_The Agriculture Core_ is a NodeJS server exposing a robust REST API allowing us to build clients on top of it.

# Description

TODO: Write description

# Development

Let's get you all setup and ready to go with _The Agriculture Core_!

## Dependencies

Well of course you need Node! You can get this [here](https://nodejs.org/en/)!

You're also going to need to install the npm packages, this can be done with the command:

`npm install`

And then to get started it's simply an npm script:

`npm start`

## Building

To build for production simply run:

`npm run build`

If you're building for development, instead run:

`npm run build:dev`

If you would prefer to just watch the changes and build them when they change (for development), you can run the following:

`npm run watch`

Note: `npm start` does run a file watcher already, so no build steps are required by you :)

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

I typically keep the webpack watcher running in the background so your tests automatically build! (ie `npm run watch`) :octocat:

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
