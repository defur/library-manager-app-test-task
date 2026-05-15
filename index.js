const loginForm = document.querySelector("#loginForm");
const message = document.querySelector("#message");
const username = document.querySelector("#username");
const password = document.querySelector("#password");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (username.value === "" || password.value === "") {
    message.textContent = "Please enter username and password.";
    return;
  }

  localStorage.setItem("loggedInUser", username.value);
  window.location.href = "app.html";
});

const savedUser = localStorage.getItem("loggedInUser");

if (savedUser) {
  window.location.href = "app.html";
}
