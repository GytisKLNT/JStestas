const currentPage = document.querySelector(".current");
currentPage.textContent = 1;

const progresBar = document.querySelector(".progresBar");

const activitiesForm = document.forms.activities;
const infoForm = document.forms.info;

const checkBoxContainer = document.querySelector(".checkBoxes");

const del = document.querySelector("#delete");

const activContainer = document.querySelector(".activities");
const infoContainer = document.querySelector(".info");
const correctContainer = document.querySelector(".correct");
const lastContainer = document.querySelector(".last");

// get data from api and display inputs in web

const createChecks = (data) => {
  const option = document.createElement("div");
  option.className = "option";
  checkBoxContainer.append(option);

  const checkInput = document.createElement("input");
  checkInput.type = "checkbox";
  checkInput.className = "box";
  checkInput.id = `${data.id}`;
  checkInput.value = `${data.id}`;

  const label = document.createElement("label");
  label.htmlFor = `${data.id}`;
  label.textContent = `${data.attributes.title}`;

  option.append(checkInput, label);
};

activitiesForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const checkedActivities = [];

  const btn = document.querySelector("#next");

  const checks = document.querySelectorAll(".box");

  for (let i = 0; i < checks.length; i++) {
    if (checks[i].checked) {
      checkedActivities.push(Number(checks[i].id));
    }
  }

  localStorage.setItem("Activities", [checkedActivities]);

  if (checkedActivities.length > 0) {
    activContainer.style.display = "none";
    infoContainer.style.display = "block";

    currentPage.textContent = 2;

    progresBar.style.width = "25%";
  } else {
    alert("You have to select one");
  }
});

const countrySelect = document.querySelector("#country");
const createOptions = (data) => {
  const option = document.createElement("option");
  option.textContent = data.attributes.country;
  option.id = "option";
  option.value = data.id;

  countrySelect.appendChild(option);
};

infoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const terms = document.querySelector("#terms");
  if (terms.checked) {
    const first_name = e.target.elements.first_name.value.trim();
    const last_name = e.target.elements.last_name.value.trim();
    const email = e.target.elements.email.value.trim();
    const country = Number(e.target.elements.country.value);
    const activities = localStorage.getItem("Activities");

    const active = activities.split(",");

    const info = {
      data: {
        first_name: first_name,
        last_name: last_name,
        email: email,
        country: country,
        activities: active,
      },
    };

    postData(info);

    infoContainer.style.display = "none";
    correctContainer.style.display = "block";
    currentPage.textContent = 3;
    progresBar.style.width = "50%";
  } else {
    alert("Please accept our Terms and conditions");
  }
});

// get data from api and display inputs in web

const table = document.querySelector("tbody");
const addTable = (data) => {
  table.innerHTML = "";
  const tr1 = table.insertRow();
  const td1 = tr1.insertCell();
  td1.textContent = "Name";
  const td2 = tr1.insertCell();
  td2.textContent = data.attributes.first_name;

  const tr2 = table.insertRow();
  const td3 = tr2.insertCell();
  td3.textContent = "Surename";
  const td4 = tr2.insertCell();
  td4.textContent = data.attributes.last_name;

  const tr3 = table.insertRow();
  const td5 = tr3.insertCell();
  td5.textContent = "Email";
  const td6 = tr3.insertCell();
  td6.textContent = data.attributes.email;

  const tr4 = table.insertRow();
  const td7 = tr4.insertCell();
  td7.textContent = "Country";
  const td8 = tr4.insertCell();
  td8.textContent = data.attributes.country.data.attributes.country;
};

const getActivities = async () => {
  try {
    const res = await fetch("http://18.193.250.181:1337/api/activities");
    const data = await res.json();

    if (data.data.length > 0) {
      data.data.forEach((element) => {
        createChecks(element);
      });
    }
  } catch (error) {
    checkBoxContainer.textContent = "Sory we are working on issue";
  }
};
const getCountries = async () => {
  try {
    const res = await fetch("http://18.193.250.181:1337/api/countries");
    const data = await res.json();

    if (data.data.length > 0) {
      data.data.forEach((element) => {
        createOptions(element);
      });
    }
  } catch (error) {
    alert(error.message || "Problem");
  }
};

const getPerson = async (id) => {
  try {
    const res = await fetch(
      `http://18.193.250.181:1337/api/people/${id}?populate=*`
    );
    const data = await res.json();

    addTable(data.data);

    del.addEventListener("click", async () => {
      const res = await fetch(`http://18.193.250.181:1337/api/people/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      location.reload();
    });
  } catch (error) {
    alert(error.message);
  }
};

const postData = async (info) => {
  try {
    const res = await fetch("http://18.193.250.181:1337/api/people", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info),
    });
    const data = await res.json();
    const id = data.data.id;

    getPerson(id);
  } catch (error) {
    return alert(error.message || "An error hs happened");
  }
};

const confirmBtn = document.querySelector("#confirm");
confirmBtn.addEventListener("click", () => {
  correctContainer.style.display = "none";
  lastContainer.style.display = "block";
  currentPage.textContent = 4;
  progresBar.style.width = "75%";
});

getActivities();
getCountries();
