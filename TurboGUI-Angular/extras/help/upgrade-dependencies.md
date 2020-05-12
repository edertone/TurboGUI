# How to upgrade all the libraries and dependencies that this project uses


This project uses libraries and dependencies from a variety of sources. To make sure that all of them are up to date, follow this steps:

- Check if angular framework must be updated (follow the official guide)

    - Copy the same version of the libraries that are updated at the root package.json file by angular updater to projects/turbogui-angular/package.json

- Open a cmd at the root of this project folder, and run:

    npm outdated
    
    Update the package.json versions based on the command result, by running:
    
      npm install libraryname@latest
      
        For each one of the outdated libraries we want to upgrade
    
- Copy the same version of the libraries that are updated at the root package.json file by npm install to projects/turbogui-angular/package.json