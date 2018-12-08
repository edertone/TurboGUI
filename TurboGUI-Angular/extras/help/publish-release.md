# How to make the library available to the public:

1 - Make sure the git tag is updated with the new project version we want to publish
    (Either in git local and remote repos)
    
2 - Make sure the library package.json version is the same as the git tag. This file is located at:

- projects/turbogui-angular
    
3 - Generate a release build (ng build turbogui-angular or tb -cb)

4 - Add the readme.md file if exists to target/turbogui-angular folder

5 - Review the target package.json file to check every thing is ok. This file is located at:

- target/turbogui-angular/package.json

6 - Open a command line inside target/turbogui-angular folder and run:

- npm publish

7 - Verify that new version appears at www.npmjs.com/~edertone