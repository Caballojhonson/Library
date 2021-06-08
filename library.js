const grid = document.getElementById('grid');
const popupScreen = document.getElementById('popupScreen')
const popupForm = document.getElementById('popupForm')
const titleField = document.getElementById('newTitle');
const authorField = document.getElementById('newAuthor');
const pageField = document.getElementById('newPages');
const titleError = document.getElementById('titleError');
const authorError = document.getElementById('authorError');
const pageError = document.getElementById('pageError');
const checkbox = document.getElementById('checkbox');

let library = [];

function Book(title, author, pages, read, index) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
    this.index = index
}

function validateForm() {

    let titleValue = titleField.value;
    let authorValue = authorField.value;
    let pageValue = pageField.value;

    if (titleValue.length > 35) {
        titleError.style.display = 'block';
         titleField.style.borderBottomColor = 'red';
    } else if (titleValue === '') {
        titleField.style.borderBottomColor = 'red';
    }else{
        titleField.style.borderBottomColor = 'grey';
        titleError.style.display = 'none';
    }

    if (authorValue.length > 25) {
        authorError.style.display = 'block';
        authorField.style.borderBottomColor = 'red';
    } else if (authorValue === '') {
        authorField.style.borderBottomColor = 'red';
    }else{
        authorField.style.borderBottomColor = 'grey';
        authorError.style.display = 'none';
    }

    if (isNaN(pageValue)) {
        pageError.style.display = 'block';
        pageField.style.borderBottomColor = 'red';
    } else if (pageValue === '') {
        pageField.style.borderBottomColor = 'red';
    }else{
        pageField.style.borderBottomColor = 'grey';
        pageError.style.display = 'none';
    }

    if (titleValue.length <= 35 && authorValue.length <= 25 && !isNaN(pageValue) && titleValue != '' && authorValue != '' && pageValue != '') {
        getInput(titleValue, authorValue, pageValue);
    }
}

function resetForm() {

    popupForm.reset();
    titleField.style.borderBottomColor = 'grey';
    authorField.style.borderBottomColor = 'grey';
    pageField.style.borderBottomColor = 'grey';

    titleError.style.display = 'none';
    authorError.style.display = 'none';
    pageError.style.display = 'none';
}

function getInput(title, author, pages) {

    let read = '';
    let index = library.length;

    if (checkbox.checked == true) {
        read = 'Read';
    } else {
        read = 'Unread';
    }

    addBook(title, author, pages, read, index);
    populateGrid();
    resetForm();
    closePop();

}

function addBook(title, author, pages, read, index) {
    library.push(new Book(title, author, pages, read, index))
    storeLocally();
}

function makeCard(i) {

    const bookDelete = document.createElement('img')
    const bookCard = document.createElement('div');
    const bookTitle = document.createElement('div');
    const bookAuthor = document.createElement('div');
    const bookPages = document.createElement('div');
    const bookRead = document.createElement('div');

    bookDelete.classList.add('deleteButton');
    bookDelete.setAttribute('src', 'icons/remove.png');
    bookDelete.setAttribute('onclick', 'removeBook(this)')
    bookCard.setAttribute('data-index', library[i].index);
    bookCard.classList.add('bookCard');
    bookTitle.classList.add('bookAttr');
    bookTitle.id = 'bookTitle';
    bookAuthor.classList.add('bookAttr');
    bookPages.classList.add('bookAttr');
    bookRead.classList.add('readBtn');
    bookRead.setAttribute('onclick', 'isRead(this)')

    bookTitle.textContent = library[i].title;
    bookAuthor.textContent = ('Written by ' + library[i].author);
    bookPages.textContent = pageFormat(library[i].pages) + ' pages long';
    bookRead.textContent = library[i].read;

    grid.appendChild(bookCard);
    bookCard.append(bookDelete, bookTitle, bookAuthor, bookPages, bookRead)

    if (library[i].read == 'Read') {
        bookCard.classList.add('bookCard', 'readCard');
        bookRead.classList.add('readBtn', 'isReadBtn')
    }
}

function populateGrid() {

    resetGrid();
    getFromSorage();
    getStats();

    for (let i = 0; i < library.length; i++) {
        makeCard(i);
    }
    const newContainer = document.getElementById('newContainer');
    grid.appendChild(newContainer);
}

function resetGrid() {

    grid.innerHTML = '';

    const newContainer = document.createElement('div');
    const newBtn = document.createElement('img');

    newContainer.id = 'newContainer';
    newBtn.id = 'addNew';
    newContainer.setAttribute('onclick', 'openPop()')
    newBtn.setAttribute('src', 'icons/add.png')

    grid.appendChild(newContainer);
    newContainer.appendChild(newBtn);

}

function openPop() {
    popupScreen.style.display = 'flex';
}

function closePop() {
    popupScreen.style.display = 'none';
}

window.onclick = function (event) {
    if (event.target == popupScreen) {
        closePop();
    }
}

popupForm.addEventListener('keyup', function(event) {
        if(event.code === 'Enter'){
            document.getElementById('add').click()
        }
    })

function removeBook(btn) {
    let cardIndex = btn.parentNode.getAttribute('data-index');
    let libraryIndex = library.findIndex(book => book.index == cardIndex)
    library.splice(libraryIndex, 1);
    storeLocally();
    getStats();
    btn.parentNode.remove();
    console.log(libraryIndex)
    console.log(cardIndex)
}

function isRead(book) {
    const cardIndex = book.parentNode.getAttribute('data-index');
    let libraryIndex = library.findIndex(book => book.index == cardIndex);

    if (library[libraryIndex].read == 'Read') {
        library[libraryIndex].read = 'Unread';
        storeLocally();
        populateGrid();
        getStats();
    } else if (library[libraryIndex].read == 'Unread') {
        library[libraryIndex].read = 'Read';
        storeLocally();
        populateGrid();
        getStats();
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

function getStats() {

    let bookEntries = library.length;
    let readBooks = library.filter(book => book.read === 'Read').length;
    let totalPages = library.map(book => parseInt(book.pages)).reduce((a, b) => a + b, 0);
    let readPages = library.filter(book => book.read === 'Read').map(book => parseInt(book.pages)).reduce((a, b) => a + b, 0);
    let bookPercent = (readBooks / bookEntries * 100).toFixed(0) + '%';
    let pagePercent = (readPages / totalPages * 100).toFixed(0) + '%';

    if (pagePercent == 'NaN%') {
        pagePercent = 0 + '%';
    }
    if (bookPercent == 'NaN%') {
        bookPercent = 0 + '%';
    }

    progressBars(bookEntries, readBooks, totalPages, readPages, bookPercent, pagePercent);
}

function pageFormat(n) {

    let length = n.toString().length;

    if (length >= 7) {
        return (n / 1000000).toFixed(1) + 'M';
    } else if (length >= 4) {
        return (n / 1000).toFixed(1) + 'k';
    } else {
        return n;
    }
}

function progressBars(bookEntries, readBooks, totalPages, readPages, bookPercent, pagePercent) {

    const readBookNum = document.getElementById('readBookNum');
    const bookNum = document.getElementById('bookNum');
    const bookGreen = document.getElementById('bookGreen')
    const readPageNum = document.getElementById('readPageNum');
    const pageNum = document.getElementById('pageNum');
    const pageGreen = document.getElementById('pageGreen');

    readBookNum.textContent = readBooks;
    bookNum.textContent = bookEntries;
    bookGreen.textContent = bookPercent;
    readPageNum.textContent = pageFormat(readPages);
    pageNum.textContent = pageFormat(totalPages);
    pageGreen.textContent = pagePercent;

    bookGreen.style.width = bookPercent;
    pageGreen.style.width = pagePercent;
}


populateGrid();