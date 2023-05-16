import { createFollows } from "../model/dao/FollowDAO";
import { createUsers } from "../model/dao/UserDAO";

let mainUserName = "@slytherine";
let followername = "@colonel";
let password = "password";
let imageUrl = "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
let firstName = "first";
let lastName = "last";

let numUsers = 50;
let batchSize = 25;
let aliasList: string[] = Array.from({length: numUsers}, (_, i) => followername + (i+1));

for(let i = 0; i < numUsers; i+=batchSize){
    createUsers(firstName, lastName, aliasList.slice(i, i+batchSize), password, imageUrl)
    createFollows(mainUserName, aliasList.slice(i, i+batchSize))
}

