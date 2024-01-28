// stickerheader header begins
window.addEventListener("scroll", function () {
  const header = document.getElementById("header");
  const headerOffset = header.offsetHeight;

  if (window.scrollY > headerOffset) {
    header.classList.add("sticky-header");
  } else {
    header.classList.remove("sticky-header");
  }
});
// sticky heaer ends

// night-mode function begins
const nightMode = document.getElementById("night-mode");
const dayMode = document.getElementById("day-mode");
const bodyElement = document.getElementById("body");
document.addEventListener("DOMContentLoaded", function () {
  dayMode.style.display = "none";

  smallNightMode.style.display = "none";
});
nightMode.addEventListener("click", function () {
  changeBodyBackground();
});

dayMode.addEventListener("click", function () {
  changeBodyBackground();
});

function changeBodyBackground() {
  nightMode.style.display =
    nightMode.style.display === "none" ? "inline-block" : "none";
  dayMode.style.display =
    dayMode.style.display === "inline-block" ? "none" : "inline-block";

  bodyElement.classList.toggle("changeBackground");
}
// night mode function ends

// logout function begins
async function clearCookieAndRedirect() {
  try {
    const response = await fetch("/users/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    /*reload the notes page after the post request
     so that the session cleared and take effect 
     and redirect to login page
    */
    location.reload();
    /*
    Now this redirect to the homepage
    */
    window.location.href = "/";
  } catch (error) {}
}
// logout function ends

// function to display edit note pop up
const editBtn = document.querySelectorAll(".edit-notes");
const popup = document.getElementById("each-note-display");
editBtn.forEach((btn) => {
  btn.addEventListener("click", function displayEditPop() {
    const noteData = JSON.parse(btn.dataset.note);
    const previousStatus = noteData.status;

    const edit_course_form = popup.querySelector("#edit-note-form");

    // Set default values in the form fields
    edit_course_form.title.value = noteData.title;
    edit_course_form.description.value = noteData.description;
    edit_course_form.due_date.value = noteData.due_date;
    // setting the previous value
    if (previousStatus === "Confirmed") {
      edit_course_form.statusConfirmed.checked = true;
    } else if (previousStatus === "Pending") {
      edit_course_form.statusPending.checked = true;
    }

    edit_course_form.noteId.value = noteData._id;

    // set display
    popup.style.display = "flex";
    const cancelButton = edit_course_form.querySelectorAll(".cancel-btn");
    cancelButton.forEach((btn) => {
      btn.addEventListener("click", function closePopup(event) {
        event.preventDefault();
        popup.style.display = "none";
      });
    });
    edit_course_form.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent the default form submission behavior
      const formData = new FormData(edit_course_form);
      const response = await fetch("/notes/dashboard/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData),
      });
      console.log("response", response);
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const htmlContent = await response.json();
          const displayPopUpMessage = document.getElementById(
            "pop-up-message-wrapper"
          );

          if (htmlContent && htmlContent.noteUpdatedSuccessfully) {
            displayPopUpMessage.innerHTML = `
        <div class="icon-wrapper">
          <i class="fa-regular fa-circle-check success-icon"></i>
        </div>
        <div class="message-wrapper">
          <h2 class="success-message">Success</h2>
          <p class="display-pop-up-message">${htmlContent.noteUpdatedSuccessfully}</p>
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
            }, 1500);
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
            }, 1500);
          } else if (
            htmlContent &&
            (htmlContent.uknownError ||
              htmlContent.zodErrorMessage ||
              htmlContent.unknownUser)
          ) {
            const errorMessage =
              htmlContent.uknownError ||
              htmlContent.zodErrorMessage ||
              htmlContent.unknownUser;

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
        }
      } else {
        displayPopUpMessage.innerHTML = `
        <div class="icon-wrapper">
          <i class="fa-regular fa-circle-xmark error-icon"></i>  
        
        </div>
        <div class="message-wrapper">
          <h2 class="success-message">Error</h2>
          <p class="display-pop-up-message">Internal Server Error</p>
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
    });
  });
});
// closing the edit note pop up

// Handle form submission

// async function submitForm(formDataObject) {
//   // Make a POST request using Fetch API

//   fetch("/notes/dashboard/edit", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(formDataObject),
//     credentials: "include",
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       // closing the pop up
//       popup.style.display = "none";
//       // referesh the page to see updates
//       location.reload();
//     })
//     .catch((error) => console.error("Error:", error));
// }

// add new btn event listener
const addNewNoteBtn = document.getElementById("add-new-notes");
const newNotePop = document.getElementById("add-new-note-pop-up");
addNewNoteBtn.addEventListener("click", function (event) {
  event.preventDefault();
  newNotePop.style.display = "flex";
  let newNoteCloseBtn = document.querySelectorAll(".cancel-btn");
  for (i = 0; i < newNoteCloseBtn.length; i++) {
    newNoteCloseBtn[i].addEventListener("click", closeNewNotePopup);
  }

  function closeNewNotePopup() {
    document.getElementById("add-new-note-pop-up").style.display = "none";
  }
  const add_course_form = document.getElementById("add-course-form");

  add_course_form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const formData = new FormData(add_course_form);
    const response = await fetch("/notes/dashboard/add-new-note", {
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

        if (htmlContent && htmlContent.createNewNote) {
          displayPopUpMessage.innerHTML = `
        <div class="icon-wrapper">
          <i class="fa-regular fa-circle-check success-icon"></i>
        </div>
        <div class="message-wrapper">
          <h2 class="success-message">Success</h2>
          <p class="display-pop-up-message">${htmlContent.createNewNote}</p>
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
          }, 1500);
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
          }, 1500);
        } else if (
          htmlContent &&
          (htmlContent.uknownError ||
            htmlContent.zodErrorMessage ||
            htmlContent.unknownUser)
        ) {
          const errorMessage =
            htmlContent.uknownError ||
            htmlContent.zodErrorMessage ||
            htmlContent.unknownUser;

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
          <p class="display-pop-up-message">Internal Server Error</p>
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
});

// code to send a POST request to delete route
const deleteNoteBtn = document.querySelectorAll(".delete-note");
deleteNoteBtn.forEach((deleteBtn) => {
  deleteBtn.addEventListener("click", function () {
    try {
      const deletePopUp = document.getElementById("delete-note-pop-up");
      const confirmDelete = document.querySelector(".confirm-btn");
      const cancelButton = document.querySelector(".no");
      const noteData = JSON.parse(deleteBtn.dataset.note);
      const noteid = noteData._id;
      console.log("noteid", noteid);
      deletePopUp.style.display = "flex";
      cancelButton.addEventListener("click", function () {
        deletePopUp.style.display = "none";
      });
      confirmDelete.addEventListener("click", async function () {
        const token = localStorage.getItem("mytoken");
        const response = await fetch("/notes/dashboard/delete-note", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
          body: JSON.stringify({ noteid }), // Include NoteId in the request body
        });

        if (response.ok) {
          deletePopUp.style.display = "none";
          location.reload();
        }

        //console.log(result); // Log the result (optional)
      });
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  });
});

// mobile screee pop up

const smallScreenPopUp = document.getElementById("mobile-screen-display");
const displaySmallScreenPopup = document.getElementById("small-screen-bar");
const hideSmallScreenPopup = document.getElementById("close-pop-up-icon");

const smallNightMode = document.getElementById("small-night-mode");
const smallDayMode = document.getElementById("small-day-mode");

displaySmallScreenPopup.addEventListener("click", function () {
  smallScreenPopUp.style.right = "0px";
  hideSmallScreenPopup.addEventListener("click", function () {
    smallScreenPopUp.style.right = "-20000px";
  });
});

smallDayMode.addEventListener("click", function () {
  smallChangeBodyBackground();
});

smallNightMode.addEventListener("click", function () {
  smallChangeBodyBackground();
});

function smallChangeBodyBackground() {
  smallDayMode.style.display =
    smallDayMode.style.display === "none" ? "inline-block" : "none";
  smallNightMode.style.display =
    smallNightMode.style.display === "none" ? "inline-block" : "none";
  bodyElement.classList.toggle("changeBackground");
  
}
