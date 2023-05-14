import { putUser } from "./model/dao/UserDAO";
import { LoginRequest } from "./model/net/request/LoginRequest";
import { RegisterRequest } from "./model/net/request/RegisterRequest";
import { login, register } from "./model/service/UserService";

register(new RegisterRequest("sylvia", "sorenson", "@sylvia1", "password", "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png")).then(data => console.log(data))