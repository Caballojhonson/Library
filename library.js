let library = [];

function Book(title, author, pages, read) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
}

function getInput() {

    let title = document.getElementById('newTitle').value;
    let author = document.getElementById('newAuthor').value;
    let pages = document.getElementById('newPages').value;
    let read = '';
    const checkbox = document.getElementById('checkbox');

    if (checkbox.checked == true) {
        read = 'Read';
    } else {
        read = 'Unread';
    }

    addBook(title, author, pages, read);
    populateGrid();
    document.getElementById('popupForm').reset();
    closePop();
}

function addBook(title, author, pages, read) {
    library.push(new Book(title, author, pages, read))
    storeLocally();
}

function makeCard(i) {

    const bookGrid = document.getElementById('grid');

    const bookDelete = document.createElement('button')
    const bookCard = document.createElement('div');
    const bookTitle = document.createElement('div');
    const bookAuthor = document.createElement('div');
    const bookPages = document.createElement('div');
    const bookRead = document.createElement('div');
    const checkbox = document.createElement('input')

    bookDelete.classList.add('bookAttr', 'deleteButton');
    bookCard.setAttribute('data-index', i);
    bookDelete.setAttribute('type', 'button');
    bookDelete.setAttribute('onclick', 'removeBook(this)')
    bookCard.classList.add('bookCard');
    bookTitle.classList.add('bookAttr');
    bookTitle.id = 'bookTitle';
    bookAuthor.classList.add('bookAttr');
    bookPages.classList.add('bookAttr');
    bookRead.classList.add('bookAttr');
    checkbox.classList.add('checkbox')
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('onclick', 'isRead(this)')

    bookDelete.textContent = 'x';
    bookTitle.textContent = library[i].title;
    bookAuthor.textContent = ('Written by ' + library[i].author);
    bookPages.textContent = library[i].pages + ' pages long';
    bookRead.textContent = library[i].read;

    bookGrid.appendChild(bookCard);
    bookCard.appendChild(bookDelete);
    bookCard.appendChild(bookTitle);
    bookCard.appendChild(bookAuthor);
    bookCard.appendChild(bookPages);
    bookCard.appendChild(bookRead);
    bookRead.appendChild(checkbox);

}

function populateGrid() {

    resetGrid();
    getFromSorage();

    for (let i = 0; i < library.length; i++) {
        makeCard(i);
    }
}

function resetGrid() {
    document.getElementById('grid').innerHTML = '';

    const newContainer = document.createElement('div');
    const newBtn = document.createElement('div');
    const grid = document.getElementById('grid')

    newContainer.id = 'newContainer';
    newBtn.id = 'addNew';
    newBtn.setAttribute('onclick', 'openPop()')
    newBtn.textContent = '+';

    grid.appendChild(newContainer);
    newContainer.appendChild(newBtn);

}

function openPop() {
    document.getElementById('popupScreen').style.display = 'flex';
}

function closePop() {
    document.getElementById('popupScreen').style.display = 'none';
}

window.onclick = function (event) {
    let modal = document.getElementById('popupScreen');
    if (event.target == modal) {
        closePop();
    }
}

function removeBook(btn) {
    let index = btn.parentNode.getAttribute('data-index')
    library.splice(index, 1);
    btn.parentNode.remove();
    storeLocally();
}

function isRead(book) {
    const index = book.parentNode.parentNode.getAttribute('data-index');
    const cardCheckboxes = document.querySelectorAll('.checkbox');

    if (book.checked == true) {
        library[index].read = 'Read';
    } else {
        library[index].read = 'Unread';
    }
    for (let i = 0; i < cardCheckboxes.length; i++) {
        if (library[i].read == 'Read') {
            cardCheckboxes[i].setAttribute('checked', '')
        }
    }
}

function storeLocally() {
    localStorage.setItem('Book', JSON.stringify(library));
}

function getFromSorage() {

    library = JSON.parse(localStorage.getItem('Book'));

    if (library === null) {
        library = [];
    }
}

populateGrid();