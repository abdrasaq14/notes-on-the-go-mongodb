document.getElementById("phone").addEventListener("input", function () {
  if (this.value.indexOf("+234") !== 0) {
    this.value = "+234";
  }
});

const fullname_input = document.querySelector(".fullname-input");
const fullname_error = document.querySelector(".fullname-error");
const fullname_confirm_icon = document.querySelector(".fullname-confirm-input");
const fullname_error_icon = document.querySelector(".fullname-wrong-input");

const email_input = document.querySelector(".email-input");
const email_error = document.querySelector(".email-error");
const email_confirm_icon = document.querySelector(".email-confirm-input");
const email_error_icon = document.querySelector(".email-wrong-input");

const phone_input = document.querySelector(".phone-input");
const phone_error = document.querySelector(".phone-error");
const phone_confirm_icon = document.querySelector(".phone-confirm-input");
const phone_error_icon = document.querySelector(".phone-wrong-input");

const new_password_input = document.querySelector(".new-password");
const new_password_error = document.querySelector(".new-password-error");
const new_password_confirm_icon = document.querySelector(
  ".password-confirm-input"
);
const new_password_error_icon = document.querySelector(".password-wrong-input");

// confirm new password
const confirm_new_password_input = document.querySelector(".confirm-password");
const confirm_new_password_error = document.querySelector(
  ".confirm-password-error"
);
const confirm_new_password_confirm_icon = document.querySelector(
  ".confirm-password-confirm-input"
);
const confirm_new_password_error_icon = document.querySelector(
  ".confirm-password-wrong-input"
);

const sign_up_btn = document.querySelector(".submit-btn");

let check_fullname = false;
let check_email = false;
let check_phone = false;
let check_password = false;
let check_confirm_password = false;
let isValid;
fullname_input.addEventListener("blur", function (e) {
  e.preventDefault();
  const minLength = 6;
  if (fullname_input.value.length < minLength) {
    fullname_error.style.display = "block";
    fullname_error_icon.style.setProperty("display", "block", "important");
    fullname_confirm_icon.style.setProperty("display", "none", "important");
    check_fullname = false;
  } else if (fullname_input.value.length >= minLength) {
    fullname_confirm_icon.style.setProperty("display", "block", "important");
    fullname_error_icon.style.setProperty("display", "none", "important");
    fullname_error.style.display = "none";
    check_fullname = true;
  }
  updateButtonState();
});
email_input.addEventListener("blur", function (e) {
  e.preventDefault();

  if (!email_input.value.includes("@") && !email_input.value.includes(".")) {
    email_error.style.display = "block";
    email_error_icon.style.setProperty("display", "block", "important");
    email_confirm_icon.style.setProperty("display", "none", "important");

    check_email = false;
  } else if (
    email_input.value.includes("@") &&
    email_input.value.includes(".") &&
    email_input.value.length >= 5
  ) {
    email_error.style.display = "none";
    email_error_icon.style.setProperty("display", "none", "important");
    email_confirm_icon.style.setProperty("display", "block", "important");

    check_email = true;
  }
  updateButtonState();
});
phone_input.addEventListener("blur", function (e) {
  e.preventDefault();

  if (phone_input.value.length < 14 || phone_input.value.length > 14) {
    phone_error.style.display = "block";
    phone_error_icon.style.setProperty("display", "block", "important");
    phone_confirm_icon.style.setProperty("display", "none", "important");
    check_phone = false;
  } else if (phone_input.value.length === 14) {
    phone_error.style.display = "none";
    phone_error_icon.style.setProperty("display", "none", "important");
    phone_confirm_icon.style.setProperty("display", "block", "important");
    check_phone = true;
  }
  updateButtonState();
});
new_password_input.addEventListener("blur", function (e) {
  e.preventDefault();
  const minLength = 6;
  if (
    new_password_input.value.length >= 1 &&
    new_password_input.value.length < minLength
  ) {
    new_password_error.style.display = "block";
    new_password_error_icon.style.setProperty("display", "block", "important");
    new_password_confirm_icon.style.setProperty("display", "none", "important");
    check_password = false;
  } else if (new_password_input.value.length >= minLength) {
    new_password_error.style.display = "none";
    new_password_error_icon.style.setProperty("display", "none", "important");
    new_password_confirm_icon.style.setProperty(
      "display",
      "block",
      "important"
    );
    check_password = true;

    console.log("currentPassword", currentPassword);
  }
  updateButtonState();
});

confirm_new_password_input.addEventListener("blur", function (e) {
  e.preventDefault();

  if (
    confirm_new_password_input.value.length >= 1 &&
    confirm_new_password_input.value !== new_password_input.value
  ) {
    confirm_new_password_error.style.display = "block";
    confirm_new_password_error_icon.style.setProperty(
      "display",
      "block",
      "important"
    );
    confirm_new_password_confirm_icon.style.setProperty(
      "display",
      "none",
      "important"
    );
    check_confirm_password = false;
  } else if (
    confirm_new_password_input.value.length >= 1 &&
    confirm_new_password_input.value === new_password_input.value
  ) {
    confirm_new_password_error.style.display = "none";
    confirm_new_password_error_icon.style.setProperty(
      "display",
      "none",
      "important"
    );
    confirm_new_password_confirm_icon.style.setProperty(
      "display",
      "block",
      "important"
    );
    check_confirm_password = true;
  }
  updateButtonState();
});
function updateButtonState() {
  if (
    check_fullname &&
    check_email &&
    check_phone &&
    check_password &&
    check_confirm_password
  ) {
    sign_up_btn.disabled = false;
  } else {
    sign_up_btn.disabled = true;
  }
}

// Initially, disable the button
updateButtonState();

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

const form = document.getElementById("signup-form");
form.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent the default form submission behavior
  const formData = new FormData(form);
  const response = await fetch("/users/signup", {
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

      if (htmlContent && htmlContent.insertUserDetailIntoDatabase) {
        displayPopUpMessage.innerHTML = `
        <div class="icon-wrapper">
          <i class="fa-regular fa-circle-check success-icon"></i>
        </div>
        <div class="message-wrapper">
          <h2 class="success-message">Success</h2>
          <p class="display-pop-up-message">${htmlContent.insertUserDetailIntoDatabase}</p>
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
          window.location.assign("/users/login");
        }, 4900);
      } else if (
        htmlContent &&
        (htmlContent.EmailExistError ||
          htmlContent.uknownError ||
          htmlContent.phoneNoError ||
          htmlContent.unableToSignYouUp ||
          htmlContent.zodErrorMessage)
      ) {
        const errorMessage =
          htmlContent.EmailExistError ||
          htmlContent.uknownError ||
          htmlContent.unableToSignYouUp ||
          htmlContent.phoneNoError ||
          htmlContent.uknownError;
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
