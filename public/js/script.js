const bioEditButton = document.getElementById("bioEditButton");
const bioEditForm = document.getElementById("bioEditForm");

bioEditButton.addEventListener("click", function () {
  if (bioEditForm.style.display === "none") {
    bioEditForm.style.display = "block";
  } else {
    bioEditForm.style.display = "none";
  }
});

const skillsEditButton = document.getElementById("skillsEditButton");
const skillsEditForm = document.getElementById("skillsEditForm");

skillsEditButton.addEventListener("click", function () {
  if (skillsEditForm.style.display === "none") {
    skillsEditForm.style.display = "block";
  } else {
    skillsEditForm.style.display = "none";
  }
});