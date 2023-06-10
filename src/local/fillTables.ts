import { execSync } from "child_process";

let mainUserName = "@calvin";
let followername = "@colonel";
let password = "password";
let imageUrl = "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
let firstName = "first";
let lastName = "last";

let numUsers = 300;
let batchSize = 25;
let aliasList: string[] = Array.from({length: numUsers}, (_, i) => followername + (i+1));
for(let i = 0; i < numUsers; i+=batchSize){
    console.log(aliasList.slice(i, i+batchSize));
}
// console.log(aliasList);
// createFollows(mainUserName, followername, numUsers)
// for(let i = 0; i < numUsers; i+=batchSize){
//     // createUsers(firstName, lastName, aliasList.slice(i, i+batchSize), password, imageUrl)
    
//     // delay(mainUserName, aliasList.slice(i, i+batchSize))
//     // if you run this code too fast, it doesn't actually write to the table.
//     // Check the table to make sure all 10,000 are there.
//     execSync('sleep 0.3');
//     console.log( (i+batchSize) + ' followers created');
// }
// async function delay(userName: string, aliases: string[]){
//     await createFollows(userName, aliases)
// }
