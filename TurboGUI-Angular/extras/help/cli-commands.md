# frequently used ANGULAR (ng) cmd commands


## Create an empty angular app

Run `ng new some-app`. A full template app will be generated

## Create an empty angular library

Run `ng generate library example-lib --prefix=lib`

## Build the library

Run `ng build turbogui-angular`. This will create a turbogui-angular folder inside the target folder, containing the compiled library

## Build the host application

Run `ng build`. This will create a host-app folder inside the target folder, containing the compiled dummy application


# frequently used NPM cmd commands


## Generate a node_modules folder strictly from package-lock file contents

If we have checkout a new project form a repo and we want to get exactly the dependencies state as it is expected on its package-lock file, we must use:

`npm ci`

We will use npm install or update only if we want to modify the dependency tree of the project (update dependency versions, remove unused ones, etc...) 

## Package the library

Move into the target/turbogui-angular folder and run `npm pack`. This will generate a turbogui-angular-X.X.X.tgz file which contains our packed library.

## Use the packed library into another application

We can use our packed library in another local application without having to publish it to npm. We can directly install the generated .tgz file into our new application by calling:

`npm install ../path/to/packed/library/packed-library-0.0.1.tgz`

This command will add our packed library as a dependency to the new project where we want to test it.

## Update the library on an application that already uses it

We can update the library changes that we perform during development easily on a project that already uses it. We can build our library and then simply copy the generated files on target/turbogui-angular to the node_modules/turbogui-angular folder of our project 