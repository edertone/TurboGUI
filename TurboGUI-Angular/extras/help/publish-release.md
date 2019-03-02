# How to make the library available to the public:

1 - Make sure all tests pass

2 - Review git log to decide the new version value based on the GIT changes: minor, major, ...
  
3 - Increase the library package.json version before increasing the GIT tag. This file is located at:

    - projects/turbogui-angular/package.json

4 - Commit and push all changes to git

5 - Make sure the git tag is updated with the new project version we want to publish
    (First in remote GIT repo and then in our Local by performing a fetch)
    
6 - Generate a release build (ng build turbogui-angular or tb -cb)

7 - Add the readme.md file if exists to target/turbogui-angular folder

8 - Review the target package.json file to check every thing is ok. This file is located at:

    - target/turbogui-angular/package.json

9 - Open a command line inside target/turbogui-angular folder and run:

    - npm publish

10 - Verify that new version appears at www.npmjs.com/~edertone