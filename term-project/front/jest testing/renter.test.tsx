const { handleInternLogin } = require("../src/components/LoginPage");

afterEach(() => {
  jest.clearAllMocks();
})(_, props);

describe("checking if intern can log in", () => {
  test("setUserLoggedIn should return false", async () => {
    props = {
      studentEmail: "nimtelson@brown.edu",
      studentPass: "abc123",
      userLoggedIn: false,
    };
    handleInternLogin(_, props);
    expect(userLoggedIn).toEqual(false);
  });

  test("setUserLoggedIn should return true", async () => {
    props = {
      studentEmail: "nya_haseley-ayende@brown.edu",
      studentPass: "password",
      userLoggedIn: false,
    };
    handleInternLogin(_, props);
    expect(userLoggedIn).toEqual(true);
  });
});
