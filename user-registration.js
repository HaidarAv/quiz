document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById("registration-form");
  const userNameInput = document.getElementById("user-name");
  const registerButton = document.getElementById("register-button");

  if (!registrationForm || !userNameInput || !registerButton) {
      console.error("Could not find required elements.");
      return;
  }

  registrationForm.addEventListener("submit", event => {
      event.preventDefault(); 

      const userName = userNameInput.value.trim();

      if (!userName) {
          alert("Please enter a username.");
          return;
      }

      fetch(`/api/check-username/${encodeURIComponent(userName)}`)
          .then(response => response.json())
          .then(result => {
              if (result.exists) {
                  console.log("User exists. Updating score...");
                  window.location.href = `/quiz/quiz.html?username=${encodeURIComponent(userName)}`;
              } else {
                  console.log("Creating new user...");
                  const data = {
                      userName: userName
                  };

                  fetch("/api/register", {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json"
                      },
                      body: JSON.stringify(data)
                  })
                      .then(response => response.json())
                      .then(result => {
                          if (result.success) {
                              console.log("User registered successfully");
                              window.location.href = `quiz.html?username=${encodeURIComponent(userName)}`;
                          } else {
                              console.error("Error registering user");
                          }
                      })
                      .catch(error => {
                          console.error("Error registering user:", error);
                      });
              }
          })
          .catch(error => {
              console.error("Error checking username:", error);
          });
  });
});
