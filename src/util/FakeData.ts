import { User } from "../model/domain/User";
import { AuthToken } from "../model/domain/AuthToken";
import { Status } from "../model/domain/Status";

const MALE_IMAGE_URL: string =
  "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
const FEMALE_IMAGE_URL: string =
  "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/daisy_duck.png";

export class FakeData {
  private readonly _authToken: AuthToken = AuthToken.Generate();

  public get authToken() {
    return this._authToken;
  }

  private readonly allUsers: User[] = [
    new User("Allen", "Anderson", "@allen", MALE_IMAGE_URL),
    new User("Amy", "Ames", "@amy", FEMALE_IMAGE_URL),
    new User("Bob", "Bobson", "@bob", MALE_IMAGE_URL),
    new User("Bonnie", "Beatty", "@bonnie", FEMALE_IMAGE_URL),
    new User("Chris", "Colston", "@chris", MALE_IMAGE_URL),
    new User("Cindy", "Coats", "@cindy", FEMALE_IMAGE_URL),
    new User("Dan", "Donaldson", "@dan", MALE_IMAGE_URL),
    new User("Dee", "Dempsey", "@dee", FEMALE_IMAGE_URL),
    new User("Elliott", "Enderson", "@elliott", MALE_IMAGE_URL),
    new User("Elizabeth", "Engle", "@elizabeth", FEMALE_IMAGE_URL),
    new User("Frank", "Frandson", "@frank", MALE_IMAGE_URL),
    new User("Fran", "Franklin", "@fran", FEMALE_IMAGE_URL),
    new User("Gary", "Gilbert", "@gary", MALE_IMAGE_URL),
    new User("Giovanna", "Giles", "@giovanna", FEMALE_IMAGE_URL),
    new User("Henry", "Henderson", "@henry", MALE_IMAGE_URL),
    new User("Helen", "Hopwell", "@helen", FEMALE_IMAGE_URL),
    new User("Igor", "Isaacson", "@igor", MALE_IMAGE_URL),
    new User("Isabel", "Isaacson", "@isabel", FEMALE_IMAGE_URL),
    new User("Justin", "Jones", "@justin", MALE_IMAGE_URL),
    new User("Jill", "Johnson", "@jill", FEMALE_IMAGE_URL),
    new User("Kent", "Knudson", "@kent", MALE_IMAGE_URL),
    new User("Kathy", "Kunzler", "@kathy", FEMALE_IMAGE_URL),
  ];

  // Allows mocking of fake users
  public get fakeUsers(): User[] {
    return this.allUsers;
  }

  private allStatuses: Status[] = [];

  // Allows mocking of fake statuses
  public get fakeStatuses(): Status[] {
    return this.allStatuses;
  }

  // Used to force statuses to be re-generated if test cases use
  // different sets of fake users (by mocking the fakeUsers method).
  private fakeUsersUsedToGenerateStatuses: User[] = [];

  private static _instance: FakeData;

  /**
   * Returns the singleton instance.
   */
  public static get instance(): FakeData {
    if (FakeData._instance == null) {
      FakeData._instance = new FakeData();
    }

    return this._instance;
  }

  private constructor() {
    // eslint-disable-next-line no-self-compare
    if (this.fakeUsers !== this.fakeUsers) {
      // Verify that this.fakeUsers always returns the same list of users (this could be violated by mock implementations of fakeUsers)
      throw new Error("fakeUsers should return the same list of fake users each time it's called");
    }

    if (this.fakeUsers !== this.fakeUsersUsedToGenerateStatuses) {
      this.generateFakeStatuses();
    }

    // eslint-disable-next-line no-self-compare
    if (this.fakeStatuses !== this.fakeStatuses) {
      // Verify that this.fakeStatuses always returns the same list of users (this could be violated by mock implementations of fakeStatuses)
      throw new Error("fakeStatuses should return the same list of fake statuses each time it's called");
    }
  }

  /**
   * Generates fake statuses for the fake users.
   */
  private generateFakeStatuses(): void {
    this.allStatuses = [];

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < this.fakeUsers.length; j++) {
        let sender = this.fakeUsers[j];
        let mention =
          j < this.fakeUsers.length - 1
            ? this.fakeUsers[j + 1]
            : this.fakeUsers[0];
        let url = "http://byu.edu";

        let post = `Post ${i} ${j}
        My friend ${mention.alias} likes this website
        ${url}`;

        let status = new Status(
          post,
          sender,
          Date.now(),
          [url],
          [mention.alias]
        );
        this.allStatuses.push(status);
      }
    }

    this.fakeUsersUsedToGenerateStatuses = this.fakeUsers;
  }

  /**
   * Returns the first fake user, or null if there are no fake users.
   */
  public get firstUser(): User | null {
    return this.fakeUsers.length > 0 ? this.fakeUsers[0] : null;
  }

  /**
   * Returns the second fake user, or null if there are not at least two fake users.
   */
  public get secondUser(): User | null {
    return this.fakeUsers.length > 1 ? this.fakeUsers[1] : null;
  }

  /**
   * Finds the user with the specified alias.
   *
   * @param alias the alias of the user to be returned.
   * @returns the user or null if no user is found with the specified alias.
   */
  public findUserByAlias(alias: string): User | null {
    for (let user of this.fakeUsers) {
      if (user.alias === alias) {
        return user;
      }
    }

    return null;
  }

  /**
   * Returns a page of users (followers or followees).
   *
   * @param lastUser the last user returned in the previous page of results.
   * @param limit maximum number of users to return (i.e., page size).
   * @param omit if not null, specifies a user that should not be returned.
   * @returns a tuple containing a page of users and a "hasMorePages" flag.
   */
  public getPageOfUsers(
    lastUser: User,
    limit: number,
    omit: User | null
  ): [User[], boolean] {
    let userIndex = 0;

    // Find the index of the first user to be returned
    if (lastUser != null) {
      for (let i = 0; i < this.fakeUsers.length; i++) {
        if (this.fakeUsers[i].alias === lastUser.alias) {
          userIndex = i + 1;
          break;
        }
      }
    }

    let fakeUsersToReturn: User[] = [];
    let count = 0;
    while (userIndex < this.fakeUsers.length && count < limit) {
      let currentUser = this.fakeUsers[userIndex];

      if (omit == null || currentUser.alias !== omit.alias) {
        fakeUsersToReturn.push(currentUser);
        count++;
      }

      userIndex++;
    }

    return [fakeUsersToReturn, userIndex < this.fakeUsers.length];
  }

  /**
   * Returns a page of statuses (story or feed items).
   *
   * @param lastStatus - the last status returned in the previous page of results.
   * @param limit - maximum number of statuses to return (i.e., page size).
   * @returns a tuple containing a page of statuses and a "hasMorePages" flag.
   */
  public getPageOfStatuses(
    lastStatus: Status,
    limit: number
  ): [Status[], boolean] {
    let statusIndex = 0;

    // Find the index of the first status to be returned
    if (lastStatus != null) {
      for (let i = 0; i < this.fakeStatuses.length; i++) {
        let currentStatus = this.fakeStatuses[i];
        if (
          currentStatus.user.alias === lastStatus.user.alias &&
          currentStatus.timestamp === lastStatus.timestamp
        ) {
          statusIndex = i + 1;
          break;
        }
      }
    }

    let fakeStatusesToReturn: Status[] = [];
    for (
      let count = 0;
      statusIndex < this.fakeStatuses.length && count < limit;
      count++, statusIndex++
    ) {
      fakeStatusesToReturn.push(this.fakeStatuses[statusIndex]);
    }

    return [fakeStatusesToReturn, statusIndex < this.fakeStatuses.length];
  }
}
