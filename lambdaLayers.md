To add a nodejs lambda layer, the zip file must follow a very specific structure. 
    - It should go as follows: zip folder name > nodejs > node_modules
In order to get this exact structure:

1. Create a folder for a new project.
2. Run npm install for all the dependencies. This will generate the node_modules folder.
3. Create a folder called 'nodejs'.
4. Copy node_modules into nodejs.
5. Zip the nodejs folder. Make sure to select the nodejs folder itself rather than selecting only its contents. It is now ready to be uploaded.