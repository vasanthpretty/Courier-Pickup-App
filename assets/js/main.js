import JustValidate from "just-validate";
import { formatMyDate } from "./utils";
import { v4 as uuidv4 } from "uuid";

// const validate = new JustValidate("#form");
const formEl = document.getElementById("form");
const localStorageKey = "courierData";

const validate = new JustValidate(formEl, {
  validateBeforeSubmitting: true,
});

validate.addField(
  "#name",
  [
    {
      rule: "required",
    },
    {
      rule: "minLength",
      value: 3,
    },
    {
      rule: "maxLength",
      value: 20,
    },
  ],
  { errorLabelCssClass: ["form-error"] }
);
validate.addField(
  "#number",
  [
    {
      rule: "number",
    },
    {
      rule: "required",
    },
    {
      rule: "minLength",
      value: 10,
    },
    {
      rule: "maxLength",
      value: 10,
    },
  ],
  { errorLabelCssClass: ["form-error"] }
);
validate.addField(
  "#pickup-date",
  [
    {
      rule: "required",
    },
  ],
  { errorLabelCssClass: ["form-error"] }
);
validate.addField(
  "#pickup-area",
  [
    {
      rule: "required",
    },
  ],
  { errorLabelCssClass: ["form-error"] }
);
validate.onSuccess(() => {
  const formData = new FormData(formEl);
  formData.append("id", uuidv4());
  formData.append("createdAt", Date.now());

  const formValueObj = Object.fromEntries(formData.entries());

  // Get existing localStorage value, if it's exist!
  const existingCourierData = localStorage.getItem("courierData");

  // Parse that string into Javascript value
  const existingCourierArray = JSON.parse(existingCourierData);

  const newCourierData = [];

  if (existingCourierArray) {
    // Create a new array and push the existing localstorage value into new array.
    existingCourierArray.push(formValueObj);

    // push the new array (which has all the info to the localstorage)
    localStorage.setItem(localStorageKey, JSON.stringify(existingCourierArray));
  } else {
    newCourierData.push(formValueObj);

    localStorage.setItem(localStorageKey, JSON.stringify(newCourierData));
  }

  alert("Courier Request submitted successfully!");
  getAllCourierDatas();
  // console.log(existingCourierArray);

  formEl.reset();
});

function getAllCourierDatas() {
  //get all datas from the local storage that are available
  const courierData = localStorage.getItem(localStorageKey);
  const courierDataArr = JSON.parse(courierData);

  console.log(courierDataArr);
  //Write those values in table UI
  const courierCardEl = document.getElementById("courierCard");
  if (courierDataArr && courierDataArr.length > 0) {
    courierCardEl.classList.remove("hidden");

    const tableEl = document.getElementById("courierDataTable");
    tableEl.innerHTML = "";

    const newFinalValue = [];
    const finalData = courierDataArr.map((courierData, index) => {
      const trEl = document.createElement("tr");
      const tdNo = document.createElement("td");
      const tdEl = document.createElement("td");
      const td2El = document.createElement("td");
      const td3El = document.createElement("td");
      const td4El = document.createElement("td");
      const td5El = document.createElement("td");
      const deleteButtonEl = document.createElement("Button");

      tdNo.classList.add("px-2", "py-1", "border");
      tdNo.textContent = index + 1;
      tdEl.classList.add("px-2", "py-1", "border");
      tdEl.textContent = courierData.name;
      td2El.classList.add("px-2", "py-1", "border");
      td2El.textContent = courierData.number;
      td3El.classList.add("px-2", "py-1", "border");
      td3El.textContent = formatMyDate(courierData.Date);
      td4El.classList.add("px-2", "py-1", "border");
      td4El.textContent = courierData["pickup-area"];

      deleteButtonEl.className =
        "bg-red-400 hover:bg-red-500 rounded px-4 font-medium py-1 text-sm";
      deleteButtonEl.textContent = "Delete";
      deleteButtonEl.addEventListener("click", (e) => {
        deleteCourierRequest(courierData);
      });

      td5El.classList.add("px-2", "py-1", "border");

      td5El.append(deleteButtonEl);

      trEl.append(tdNo, tdEl, td2El, td3El, td4El, td5El);

      newFinalValue.push(trEl);
    });
    newFinalValue.forEach((el) => tableEl.append(el));
    const courierCountEl = document.querySelector("#courierCount");
    courierCountEl.textContent = newFinalValue.length;
  } else {
    courierCardEl.classList.add("hidden");
    console.log("no vlaue");
  }

  //display those datas in UI
}

function deleteCourierRequest(courierRequest) {
  const confirmation = confirm(
    `do you want to delete ${courierRequest["name"]}`
  );
  if (confirmation) {
    const existingCourierData = localStorage.getItem(localStorageKey);
    const courierDataObj = JSON.parse(existingCourierData);
    const otherRecords = courierDataObj.filter(
      (courierReq) => courierReq.id != courierRequest["id"]
    );

    // push it in local storage
    localStorage.setItem(localStorageKey, JSON.stringify(otherRecords));
    alert("deleted");
    getAllCourierDatas();
  }
}

getAllCourierDatas();
