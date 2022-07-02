// bas endpoint for user's manipulations (as argument used in fetch)
const rootURL = "/api/";

// Register user

const registerUser = async () => {
    const username = document.querySelector("#register-username").value;
    const password = document.querySelector("#register-password").value;

    const user = {
        username,
        password,
    };

    try {
        const res = await fetch(`${rootURL}register`, {
            method: "post",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        console.log(data);
    } catch (error) {
        console.error("Error: ", error);
    }

    // clear input fields
    document.querySelector("#register-username").value = "";
    document.querySelector("#register-password").value = "";
};

/* const registerUser = async () => {
    const username = document.querySelector("#register-username").value;
    const password = document.querySelector("#register-password").value;

    const user = {
        username,
        password
    };

    try {
        const res = await fetch(`${rootURL}register`, {
          method: "post",
          body: JSON.stringify(user),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.error("Error: ", error);
      }
    
      document.querySelector("#register-username").value = "";
      document.querySelector("#register-password").value = "";
    }; */


// Login user
const loginUser = async () => {
    const username = document.querySelector("#login-username").value;
    const password = document.querySelector("#login-password").value;

    const user = {
        username,
        password
    };

    try {
        const res = await fetch(`${rootURL}login`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (res.status !== 401) {
            const data = await res.json();
            console.log(data);
        } else {
            throw "Wrong username or password";
        }
    } catch (error) {
        console.error("Error : ", error);
    }

    // clear input fields
    document.querySelector("#login-username").value = "";
    document.querySelector("#login-password").value = "";
};

// check authentication/ whether user is logged in
const checkLoggedInStatus = async () => {
    try {
        const res = await fetch(`${rootURL}authenticated`);
        if (res.status !== 401) {
            const data = await res.json();
            console.log(data);
        } else {
            throw "Looks like you need to login first.";
        }
    } catch (error) {
        console.log("Error: ", error);
    }
};

// logout user
const logout = async () => {
    try {
        const res = await fetch(`${rootURL}logout`);
        if (res.status !== 401) {
            const data = await res.json();
            console.log(data);
        } else {
            throw "You need to be logged in in order to log out.";
        }
    } catch (error) {
        console.error("Error: ", error);
    }
};