import { execSync } from "child_process";
import { FollowDaoFillTable } from "./FollowDaoFillTable";
import { UserDaoFillTable } from "./UserDaoFillTable";
import { User } from "../model/entities";

//This code assumes that you have already created a user with the mainUserName. 
// Since async and await don't work here, I try using execsync to prevent throttling of the dynamodb tables.
// Throttling causes items to not be written.
// Make sure to increase the write capacities for the follow and user tables. You may need to increase the write capacity on the follow index as well.

let mainUserName = "@cat";
let followername = "@serpent";
let password = "password";
let imageUrl = "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
let firstName = "first";
let lastName = "last";

let numUsers = 10000;
let batchSize = 25;
let aliasList: string[] = Array.from({length: numUsers}, (_, i) => followername + (i+1));
let followDaoFillTable = new FollowDaoFillTable();
let userDaoFillTable = new UserDaoFillTable();

console.log('setting followers');
setFollowers(0);
console.log('setting users');
setUsers(0);
userDaoFillTable.increaseFollowersCount(mainUserName, numUsers);

function setFollowers(i: number){
    if(i >= numUsers) return;
    else if(i % 1000 == 0) {
        console.log(i + ' followers');
    }
    let followList = aliasList.slice(i, i + batchSize);
    followDaoFillTable.createFollowsInBatches(mainUserName, followList)
    .then(()=> setFollowers(i + batchSize))
    .catch(err => console.log('error while setting followers: ' + err));
}
function setUsers(i: number){
    if(i >= numUsers) return;
    else if(i % 1000 == 0) {
        console.log(i + ' users');
    }
    let userList = createUserList(i);
    // console.log(userList);
    userDaoFillTable.createUsers(userList, password)
    .then(()=> setUsers(i + batchSize))
    .catch(err => console.log('error while setting users: ' + err));
}


function createUserList(i : number) {
    let users : User[] = [];
    let limit = i + batchSize
    for(let j = i; j < limit; ++j){
        let user = new User(firstName + j, lastName + j, followername + j, imageUrl);
        users.push(user);
    }
    return users;
}
