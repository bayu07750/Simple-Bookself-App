const UNCOMPLETED_LIST_BOOK_ID = ".not-finished-wrapper > .items";
const COMPLETED_LIST_BOOK_ID = ".finished-wrapper > .items";
const BOOK_ITEM_ID = "itemId";
const STORAGE_KEY = "local_storage";
let books = [];

class Book {
  id = +new Date();
  constructor(title, author, year, isCompleted) {
    this.title = title;
    this.author = author;
    this.year = year;
    this.isCompleted = isCompleted;
  }
}

function createTrashButton() {
  return createButton("delete", "Hapus", "fas fa-trash", function (e) {
    if (e.target.getAttribute("id") === "delete") {
      document.body.append(createAlert("Apakah anda yakin ingin menghapus?", e.target.parentElement.parentElement));
    }
  });
}

function createCheckButton() {
  return createButton("markAsRead", "Selesai", "fas fa-check", function (e) {
    if (e.target.getAttribute("id") === "markAsRead") {
      addBookToCompleted(e.target.parentElement.parentElement);
    }
  });
}

function createUndoButton() {
  return createButton("undo", "Undo", "fas fa-undo", function (e) {
    if (e.target.getAttribute("id") === "undo") {
      undoBookFromCompleted(e.target.parentElement.parentElement);
    }
  });
}

function addBookToCompleted(taskElement) {
  const completedListBook = document.querySelector(COMPLETED_LIST_BOOK_ID);
  const title = taskElement.querySelector("#textTitle").innerText;
  const author = taskElement.querySelector("#textAuthor").innerText;
  const year = taskElement.querySelector("#textYear").innerText;

  const newBook = makeCardBook(title, author, year, true);

  const book = findBook(taskElement[BOOK_ITEM_ID]);
  book.isCompleted = true;
  newBook[BOOK_ITEM_ID] = book.id;

  completedListBook.append(newBook);
  taskElement.remove();

  updateDataToStorage();
}

function removeBookFromCompleted(taskElement) {
  const bookPosition = findBookIndex(taskElement[BOOK_ITEM_ID]);
  books.splice(bookPosition, 1);

  taskElement.remove();
  updateDataToStorage();
}

function undoBookFromCompleted(taskElement) {
  const uncompletedListBook = document.querySelector(UNCOMPLETED_LIST_BOOK_ID);
  const title = taskElement.querySelector("#textTitle").innerText;
  const author = taskElement.querySelector("#textAuthor").innerText;
  const year = taskElement.querySelector("#textYear").innerText;

  const newBook = makeCardBook(title, author, year, false);

  const book = findBook(taskElement[BOOK_ITEM_ID]);
  book.isCompleted = false;
  newBook[BOOK_ITEM_ID] = book.id;

  uncompletedListBook.append(newBook);
  taskElement.remove();

  updateDataToStorage();
}

function refreshDataFromBooks(listBook) {
  const uncompletedListBook = document.querySelector(UNCOMPLETED_LIST_BOOK_ID);
  const completedListBook = document.querySelector(COMPLETED_LIST_BOOK_ID);
  uncompletedListBook.innerHTML = null;
  completedListBook.innerHTML = null;

  for (book of listBook) {
    const newBook = makeCardBook(book.title, book.author, book.year, book.isCompleted);
    newBook[BOOK_ITEM_ID] = book.id;
    book.isCompleted ? completedListBook.append(newBook) : uncompletedListBook.append(newBook);
  }
}

function loadDataFromStorage() {
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (data !== null) books = data;
  document.dispatchEvent(new Event("ondataloaded"));
}

function addBook() {
  const uncompletedListBook = document.querySelector(UNCOMPLETED_LIST_BOOK_ID);

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;

  const book = makeCardBook(title, author, year, false);
  const bookOject = new Book(title, author, year, false);

  book[BOOK_ITEM_ID] = bookOject.id;
  books.push(bookOject);

  uncompletedListBook.append(book);
  updateDataToStorage();
}

document.addEventListener("DOMContentLoaded", function () {
  const formBook = document.getElementById("form-book");
  formBook.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
    formBook.reset();
  });

  document.getElementById("search-form").addEventListener("submit", function (e) {
    e.preventDefault();
  });

  const searchQuery = document.getElementById("searchQuery");
  searchQuery.addEventListener("input", function () {
    if (!searchQuery.value) {
      refreshDataFromBooks(books);
    } else {
      const filterBooks = books.filter((value) => value.title.toLowerCase().includes(searchQuery.value.toLowerCase()));
      filterBooks.length >= 1 ? refreshDataFromBooks(filterBooks) : refreshDataFromBooks(books);
    }
  });

  if (isStorageExist()) loadDataFromStorage();
});

document.addEventListener("ondataloaded", () => {
  refreshDataFromBooks(books);
});

document.getElementById("btnBackToTop").addEventListener("click", function () {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});

window.addEventListener("scroll", function () {
  if (document.body.scrollTop > 60 || document.documentElement.scrollTop > 60) {
    btnBackToTop.style.visibility = "visible";
    btnBackToTop.style.opacity = 1;
  } else {
    btnBackToTop.style.visibility = "hidden";
    btnBackToTop.style.opacity = 0;
  }
});
