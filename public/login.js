let signup = document.querySelector(".signup");
let login = document.querySelector(".login");
let slider = document.querySelector(".slider");
let formSection = document.querySelector(".form-section");

signup.addEventListener("click", () => {
  slider.classList.add("moveslider");
  formSection.classList.add("form-section-move");
});

login.addEventListener("click", () => {
  slider.classList.remove("moveslider");
  formSection.classList.remove("form-section-move");
});

const loginBtn = document.querySelector(".btn-login");
const signUpBtn = document.querySelector(".btn-signup");

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = document.querySelector(".username").value;
  const password = document.querySelector(".password").value;

  // console.log({ username, password });
  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Successful login
      console.log(data.message);
      alert("Login Successful");

      window.location.href = "/game";

      // Assuming you have received the token after successful login
      const token = data.token;
      // Set the token as a cookie with an expiration date
      const expirationDate = new Date(Date.now() + 24 * 3600 * 1000); // Cookie expires in 1 day
      document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}; path=/;`;

      // You might want to update the UI to show the game content
    } else {
      // Failed login
      console.error(data.message);
      alert(data.message);
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
});

signUpBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = document.querySelector(".username1").value;
  const password = document.querySelector(".password1").value;
  const Cpassword = document.querySelector(".Cpassword1").value;

  if (Cpassword === password) {
    // console.log({ username, password });
    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        // console.log(data.message);
        alert("SignUp Successful, Please Login Now");
      } else {
        // Failed login
        console.error(data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  } else {
    alert("Check Password");
  }
});
