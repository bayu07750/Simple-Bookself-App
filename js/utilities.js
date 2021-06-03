function makeCardBook(title, author, year, isCompleted) {
  const textTitle = document.createElement("h3");
  textTitle.setAttribute("id", "textTitle");
  textTitle.innerText = title;

  const textAuthor = document.createElement("p");
  textAuthor.setAttribute("id", "textAuthor");
  textAuthor.innerText = author;

  const textYear = document.createElement("p");
  textYear.setAttribute("id", "textYear");
  textYear.innerText = year;

  const article = document.createElement("article");
  article.append(textTitle, textAuthor, textYear);

  const btnDelete = createTrashButton();
  const btnCheckOrUndo = isCompleted ? createUndoButton() : createCheckButton();

  const btnGroup = document.createElement("div");
  btnGroup.classList.add("btn-group");
  btnGroup.append(btnDelete, btnCheckOrUndo);

  const card = document.createElement("div");
  card.classList.add("card");
  card.append(article, btnGroup);

  return card;
}

function createButton(btnId, message, typeClass, eventListener) {
  const iIcon = document.createElement("i");
  iIcon.classList.value = typeClass;

  const button = document.createElement("button");
  button.setAttribute("id", btnId);
  button.innerText = message;
  button.append(iIcon);

  button.addEventListener(
    "click",
    function (e) {
      eventListener(e);
    },
    true
  );

  return button;
}

const createAlert = (message, taskElement) => {
  const alertTitle = document.createElement("h2");
  alertTitle.innerText = "Konfirmasi";

  const alertMessage = document.createElement("p");
  alertMessage.innerText = message;

  const btnNo = document.createElement("button");
  btnNo.classList.add("btn", "btn-outline");
  btnNo.innerText = "Tidak";

  const btnYes = document.createElement("button");
  btnYes.classList.add("btn");
  btnYes.innerText = "Ya";

  const btnGroup = document.createElement("div");
  btnGroup.classList.add("btn-group");
  btnGroup.append(btnNo, btnYes);

  const innerAlert = document.createElement("div");
  innerAlert.classList.add("alert");
  innerAlert.append(alertTitle, alertMessage, btnGroup);

  const alertWrapper = document.createElement("div");
  alertWrapper.classList.add("alert-wrapper");
  alertWrapper.append(innerAlert);

  btnNo.addEventListener("click", function (e) {
    alertWrapper.remove();
  });

  btnYes.addEventListener("click", function (e) {
    removeBookFromCompleted(taskElement);
    alertWrapper.remove();
  });

  return alertWrapper;
};

function updateDataToStorage() {
  if (isStorageExist()) saveData();
}

function saveData() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
}

function findBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) return book;
  }
  return null;
}

function findBookIndex(bookId) {
  let index = 0;
  for (const book of books) {
    if (book.id === bookId) return index;
    index++;
  }
  return -1;
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser yang anda gunakan tidak mendukung Local Storage");
    return false;
  }
  return true;
}
