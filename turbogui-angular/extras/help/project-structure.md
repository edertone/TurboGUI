# How is this project structured

- The root project is a dummy angular app that is used to host and launch our library.

- The real library code is found inside projects/turbogui-angular

## Root package.json

- The root package.json file contains dependencies for both the application and the library. Any package that is needed to run or build either the application or the project must be in here.

## Library package.json

- The library project package.json is in the projects/turbogui-angular directory and tells ng-packagr what information goes into the distribution package.json that will be shipped with our library

## Library distribution package.json

- This package.json file is generated as part of the library build process into target/turbogui-angular. It is the package.json file that gets released with our library. **This file must not be modified**.