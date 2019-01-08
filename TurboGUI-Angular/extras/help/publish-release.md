# How to make the library available to the public:

1 - Review git log to decide the new version value based on the GIT changes: minor, major, ...
  
2 - Increase the library package.json version before increasing the GIT tag. This file is located at:

- projects/turbogui-angular/package.json

3 - Commit and push all changes to git

4 - Make sure the git tag is updated with the new project version we want to publish
    (Either in git local and remote repos)
    
5 - Generate a release build (ng build turbogui-angular or tb -cb)

6 - Add the readme.md file if exists to target/turbogui-angular folder

7 - Review the target package.json file to check every thing is ok. This file is located at:

- target/turbogui-angular/package.json

8 - Open a command line inside target/turbogui-angular folder and run:

- npm publish

9 - Verify that new version appears at www.npmjs.com/~edertone