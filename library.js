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

    const bookDelete = document.createElement('img')
    const bookCard = document.createElement('div');
    const bookTitle = document.createElement('div');
    const bookAuthor = document.createElement('div');
    const bookPages = document.createElement('div');
    const bookRead = document.createElement('div');

    bookDelete.classList.add('deleteButton');
    bookDelete.setAttribute('src', 'icons/remove.png');
    bookDelete.setAttribute('onclick', 'removeBook(this)')
    bookCard.setAttribute('data-index', i);
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

    bookGrid.appendChild(bookCard);
    bookCard.appendChild(bookDelete);
    bookCard.appendChild(bookTitle);
    bookCard.appendChild(bookAuthor);
    bookCard.appendChild(bookPages);
    bookCard.appendChild(bookRead);

    if(library[i].read == 'Read') {
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
    document.getElementById('grid').appendChild(newContainer);
}

function resetGrid() {

    document.getElementById('grid').innerHTML = '';

    const newContainer = document.createElement('div');
    const newBtn = document.createElement('img');
    const grid = document.getElementById('grid');

    newContainer.id = 'newContainer';
    newBtn.id = 'addNew';
    newContainer.setAttribute('onclick', 'openPop()')
    newBtn.setAttribute('src', 'icons/add.png')

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
    getStats();
}

function isRead(book) {
    const index = book.parentNode.getAttribute('data-index');

    if (library[index].read == 'Read') {
        library[index].read = 'Unread';
        storeLocally();
        populateGrid(); 
        getStats();
        return false;
    }else if (library[index].read == 'Unread') {
        library[index].read = 'Read';
        storeLocally();
        populateGrid();
        getStats(); 
        return true;
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

    progressBars(bookEntries, readBooks, totalPages, readPages, bookPercent, pagePercent);
}

function pageFormat(n) {

    let length = n.toString().length;

    if(length >= 7) {
        return (n / 1000000).toFixed(1) + 'M';
    }else if(length >= 4) {
        return (n / 1000).toFixed(1) + 'k';
    }else{
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