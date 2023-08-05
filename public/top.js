const table1Btn = document.getElementById("5");
const table2Btn = document.getElementById("10");
const table3Btn = document.getElementById("15");

const table1 = document.getElementById("table1");
const table2 = document.getElementById("table2");
const table3 = document.getElementById("table3");

const buttons = document.querySelectorAll(".round-button");
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("selected"));
    button.classList.add("selected");
  });
});

const tableContainer = document.getElementsByClassName("table-container");

table1Btn.classList.add("selected");
table1.style.display = "table";
table2.style.display = "none";
table3.style.display = "none";

table1Btn.addEventListener("click", () => {
  table1.style.display = "table";
  table2.style.display = "none";
  table3.style.display = "none";
});

table2Btn.addEventListener("click", () => {
  table1.style.display = "none";
  table2.style.display = "table";
  table3.style.display = "none";
});

table3Btn.addEventListener("click", () => {
  table1.style.display = "none";
  table2.style.display = "none";
  table3.style.display = "table";
});
