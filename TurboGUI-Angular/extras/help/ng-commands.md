# frequently used ANGULAR (ng) cmd commands


## Build the library

Run `ng build turbogui-angular`. This will create a turbogui-angular folder inside the target folder, containing the compiled library

## Build the host application

Run `ng build`. This will create a host-app folder inside the target folder, containing the compiled dummy application

## Package the library

Move into the target/turbogui-angular folder and run `npm pack`. This will generate a turbogui-angular-X.X.X.tgz file which contains our packed library.

## Use the packed library into another application

We can use our packed library in another local application without having to publish it to npm. We can directly install the generated .tgz file into our new application by calling:

- npm install ../path/to/packed/library/packed-library-0.0.1.tgz

This command will add our packed library as a dependency to the new project where we want to test it.