const loggedUser = document.querySelector("#loggedUser");
const logoutButton = document.querySelector("#logoutButton");

const authorForm = document.querySelector("#authorForm");
const authorName = document.querySelector("#authorName");
const authorsList = document.querySelector("#authorsList");

const bookForm = document.querySelector("#bookForm");
const bookTitle = document.querySelector("#bookTitle");
const bookAuthor = document.querySelector("#bookAuthor");
const booksList = document.querySelector("#booksList");
const searchInput = document.querySelector("#searchInput");
const exportButton = document.querySelector("#exportButton");

let authors = JSON.parse(localStorage.getItem("authors")) || [];
let books = JSON.parse(localStorage.getItem("books")) || [];

const user = localStorage.getItem("loggedInUser");

if (!user) {
  window.location.href = "index.html";
}

loggedUser.textContent = user;

function saveAuthors() {
  localStorage.setItem("authors", JSON.stringify(authors));
}

function saveBooks() {
  localStorage.setItem("books", JSON.stringify(books));
}

function renderAuthors() {
  authorsList.innerHTML = "";
  bookAuthor.innerHTML = "";

  if (authors.length === 0) {
    authorsList.innerHTML = "<p>No authors added yet.</p>";
    bookAuthor.innerHTML = "<option value=''>Add an author first</option>";
    return;
  }

  authors.forEach((author) => {
    const option = document.createElement("option");
    option.value = author.id;
    option.textContent = author.name;
    bookAuthor.appendChild(option);

    const authorItem = document.createElement("div");
    authorItem.className = "author-item";
    authorItem.innerHTML = `
      <strong>${author.name}</strong>
      <br>
      <button onclick="deleteAuthor(${author.id})">Delete author and books</button>
    `;
    authorsList.appendChild(authorItem);
  });
}

function renderBooks() {
  booksList.innerHTML = "";

  const searchText = searchInput.value.toLowerCase();

  const filteredBooks = books.filter((book) => {
    const author = authors.find((item) => item.id === book.authorId);
    const authorNameText = author ? author.name.toLowerCase() : "";

    return (
      book.title.toLowerCase().includes(searchText) ||
      authorNameText.includes(searchText)
    );
  });

  if (filteredBooks.length === 0) {
    booksList.innerHTML = "<p>No books found.</p>";
    return;
  }

  filteredBooks.forEach((book) => {
    const author = authors.find((item) => item.id === book.authorId);
    const authorNameText = author ? author.name : "Unknown author";

    const bookItem = document.createElement("div");
    bookItem.className = "book-item";
    bookItem.innerHTML = `
      <p class="book-title">${book.title}</p>
      <p class="small-text">Author: ${authorNameText}</p>
      <button onclick="editBook(${book.id})">Edit</button>
      <button onclick="deleteBook(${book.id})">Delete</button>
    `;
    booksList.appendChild(bookItem);
  });
}

authorForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newAuthor = {
    id: Date.now(),
    name: authorName.value
  };

  authors.push(newAuthor);
  saveAuthors();
  authorName.value = "";
  renderAuthors();
});

bookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (authors.length === 0) {
    alert("Please add an author first.");
    return;
  }

  const newBook = {
    id: Date.now(),
    title: bookTitle.value,
    authorId: Number(bookAuthor.value)
  };

  books.push(newBook);
  saveBooks();
  bookTitle.value = "";
  renderBooks();
});

function deleteBook(bookId) {
  books = books.filter((book) => book.id !== bookId);
  saveBooks();
  renderBooks();
}

function editBook(bookId) {
  const book = books.find((item) => item.id === bookId);
  const newTitle = prompt("Enter new book title:", book.title);

  if (newTitle === null || newTitle === "") {
    return;
  }

  book.title = newTitle;
  saveBooks();
  renderBooks();
}

function deleteAuthor(authorId) {
  authors = authors.filter((author) => author.id !== authorId);
  books = books.filter((book) => book.authorId !== authorId);

  saveAuthors();
  saveBooks();
  renderAuthors();
  renderBooks();
}

searchInput.addEventListener("input", renderBooks);

exportButton.addEventListener("click", () => {
  const exportedBooks = books.map((book) => {
    const author = authors.find((item) => item.id === book.authorId);
    const authorNameText = author ? author.name : "Unknown author";

    return `${book.title} - ${authorNameText}`;
  });

  const fileText = exportedBooks.join("\n");
  const file = new Blob([fileText], { type: "text/plain" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(file);
  link.download = "books.txt";
  link.click();
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
});

renderAuthors();
renderBooks();
