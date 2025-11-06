# How to make the library available to the public:

1 - Update all the project dependencies if necessary
    (See the related help file for docs on how to upgrade dependencies)
    
2 - Make sure all tests pass

3 - Review git log to decide the new version value based on the GIT changes: minor, major, ...
  
4 - Increase the library package.json version before increasing the GIT tag. This file is located at:

    - projects/turbogui-angular/package.json

5 - Commit and push all changes to git

6 - Make sure the git tag is updated with the new project version we want to publish
    (First in remote GIT repo and then in our Local by performing a fetch)
    
7 - Generate a release build (ng build turbogui-angular or tb -cb)

8 - Add the readme.md file if exists to target/turbogui-angular folder

9 - Review the target package.json file to check every thing is ok. This file is located at:

    - target/turbogui-angular/package.json

10 - Open a command line inside target/turbogui-angular folder and run:

    - npm publish

11 - Verify that new version appears at www.npmjs.com/~edertone