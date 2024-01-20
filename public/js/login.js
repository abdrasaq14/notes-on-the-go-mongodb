function togglePasswordVisibility(
  e,
  elementId,
  eyeIconSelector,
  eyeSlashIconSelector
) {
  e.preventDefault();
  const passwordInput = document.getElementById(elementId);
  const eyeIcon = e.target
    .closest(".input-inline-btn-wrapper")
    .querySelector(eyeIconSelector);
  const eyeSlashIcon = e.target
    .closest(".input-inline-btn-wrapper")
    .querySelector(eyeSlashIconSelector);

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.style.display = "none";
    eyeSlashIcon.style.setProperty("display", "block", "important");
  } else {
    passwordInput.type = "password";
    eyeIcon.style.display = "block";
    eyeSlashIcon.style.setProperty("display", "none", "important");
  }
}

const form = document.getElementById("login-form");
form.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent the default form submission behavior
  const formData = new FormData(form);
  const response = await fetch("/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(formData),
  });
  if (response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const htmlContent = await response.json();
      const displayPopUpMessage = document.getElementById(
        "pop-up-message-wrapper"
      );

      if (htmlContent && htmlContent.loginSuccessful) {
        displayPopUpMessage.innerHTML = `
        <div class="icon-wrapper">
          <i class="fa-regular fa-circle-check success-icon"></i>
        </div>
        <div class="message-wrapper">
          <h2 class="success-message">Success</h2>
          <p class="display-pop-up-message">${htmlContent.loginSuccessful}</p>
        </div>
        <div class="close-wrapper">
          <p class="close-text">CLOSE</p>
        </div>
        `;
        const iconWrapper = document.querySelector(".icon-wrapper");
        iconWrapper.style.backgroundColor = "rgb(8, 207, 88)";
        displayPopUpMessage.style.display = "flex";
        displayPopUpMessage.classList.add("after-success");

        setTimeout(() => {
          displayPopUpMessage.style.animation =
            "slide-out 1s ease-in-out backwards";
        }, 4000);
        const closeBtn = document.querySelector(".close-text");
        closeBtn.addEventListener("click", function () {
          displayPopUpMessage.classList.remove("after-success");
          displayPopUpMessage.style.animation = "";
          displayPopUpMessage.style.display = "none";
        });
        setTimeout(() => {
          displayPopUpMessage.classList.remove("after-success");
          displayPopUpMessage.style.animation = "";
          displayPopUpMessage.style.display = "none";
          window.location.assign("/notes/dashboard");
        }, 1800);
      } else if (
        htmlContent &&
        (htmlContent.noSuchUserError ||
          htmlContent.uknownError ||
          htmlContent.invalidPassword ||
          htmlContent.zodErrorMessage)
      ) {
        const errorMessage =
          htmlContent.noSuchUserError ||
          htmlContent.uknownError ||
          htmlContent.invalidPassword ||
          htmlContent.zodErrorMessage;
        displayPopUpMessage.innerHTML = `
        <div class="icon-wrapper">
          <i class="fa-regular fa-circle-xmark error-icon"></i>  
        
        </div>
        <div class="message-wrapper">
          <h2 class="success-message">Error</h2>
          <p class="display-pop-up-message">${errorMessage}</p>
        </div>
        <div class="close-wrapper">
          <p class="close-text">CLOSE</p>
        </div>
        `;
        const iconWrapper = document.querySelector(".icon-wrapper");
        iconWrapper.style.backgroundColor = "#ff0173";

        displayPopUpMessage.style.display = "flex";
        displayPopUpMessage.classList.add("after-error");

        setTimeout(() => {
          displayPopUpMessage.style.animation =
            "slide-out 1s ease-in-out backwards";
        }, 4000);
        const closeBtn = document.querySelector(".close-text");
        closeBtn.addEventListener("click", function () {
          displayPopUpMessage.classList.remove("after-error");
          displayPopUpMessage.style.animation = "";
          displayPopUpMessage.style.display = "none";
        });
        setTimeout(() => {
          displayPopUpMessage.classList.remove("after-error");
          displayPopUpMessage.style.animation = "";
          displayPopUpMessage.style.display = "none";
        }, 4900);
      }
    } else {
      displayPopUpMessage.innerHTML = `
        <div class="icon-wrapper">
          <i class="fa-regular fa-circle-xmark error-icon"></i>  
        
        </div>
        <div class="message-wrapper">
          <h2 class="success-message">Error</h2>
          <p class="display-pop-up-message">Unable to create account</p>
        </div>
        <div class="close-wrapper">
          <p class="close-text">CLOSE</p>
        </div>
        `;

      displayPopUpMessage.style.display = "flex";
      displayPopUpMessage.classList.add("after-error");

      setTimeout(() => {
        displayPopUpMessage.style.animation =
          "slide-out 1s ease-in-out backwards";
      }, 4000);
      const closeBtn = document.querySelector(".close-text");
      closeBtn.addEventListener("click", function () {
        displayPopUpMessage.classList.remove("after-error");
        displayPopUpMessage.style.animation = "";
        displayPopUpMessage.style.display = "none";
      });
      setTimeout(() => {
        displayPopUpMessage.classList.remove("after-error");
        displayPopUpMessage.style.animation = "";
        displayPopUpMessage.style.display = "none";
      }, 4900);
    }
  }
});
