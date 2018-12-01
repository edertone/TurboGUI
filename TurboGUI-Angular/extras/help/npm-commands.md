# frequently used NPM cmd commands


## Generate a node_modules folder strictly from package-lock file contents

If we have checkout a new project form a repo and we want to get exactly the dependencies state as it is expected on its package-lock file, we must use:

npm ci

We will use npm install or update only if we want to modify the dependency tree of the project (update dependency versions, remove unused ones, etc...) 

## Package the library

Move into the target/turbogui-angular folder and run `npm pack`. This will generate a turbogui-angular-X.X.X.tgz file which contains our packed library.

## Use the packed library into another application

We can use our packed library in another local application without having to publish it to npm. We can directly install the generated .tgz file into our new application by calling:

- npm install ../path/to/packed/library/packed-library-0.0.1.tgz

This command will add our packed library as a dependency to the new project where we want to test it.