'use strict'

function oninit() {
    renderBooks()
}

function renderBooks() {
    const books = getBooksForDisplay()
    var strHTMLs = `
    <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Price</th>
                <th>Actions</th>
            </tr>
    </thead>`
    strHTMLs += books.map(book => {
        return `
    <tr class="book-item">
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.price} $</td>
            <td>
                <button class="read-btn" onclick="onOpenBookDesc('${book.id}')">Read</button>
                <button class="update-btn" onclick="onOpenUpdateModal('${book.id}')">Update</button>
                <button class="delete-btn" onclick="onDeleteBook('${book.id}')">Delete</button>
            </td>
    </tr>
        `
    }).join('')
    document.querySelector('.books-list').innerHTML = strHTMLs
}

function onOpenUpdateModal(bookId) {
    const book = getBookById(bookId)
    const elUpdateModal = document.querySelector('.update-modal')
    elUpdateModal.innerHTML = `<div class="update-content">
            <form class="book-update" onsubmit="onUpdateBook(event, '${bookId}')">
                <input value="${book.title}" type="text" name="title-update-from-modal" />
                <input value="${book.price}" type="number" class="book-price-update" name="price-update-from-modal" />
                <button>Update</button>
            </form>
        </div>`

    elUpdateModal.classList.add('open')
}

function onUpdateBook(ev, bookId) {
    ev.preventDefault()
    document.querySelector('.update-modal').classList.remove('open')
    const title = document.querySelector('[name="title-update-from-modal"]').value
    const newPrice = document.querySelector('[name="price-update-from-modal"]').value

    if (!newPrice || newPrice < 0 || !title.length || title.length === 0) {
        alert('Eror!\npls update both fields with valid values')
        return
    }
    updatePrice(bookId, newPrice)
    updateTitle(bookId, title)

    renderBooks()
}

function onAddBook(ev) {
    ev.preventDefault()
    const title = document.querySelector('[name="book-title-add"]').value
    const price = document.querySelector('[name="book-price-add"]').value
    if (!price || price < 0 || !title.length || title.length === 0) {
        alert('Eror!\npls fill both fields with values,\nbefoure adding a new book.')
        return
    }
    addBook(title, price)
    renderBooks()
}

function onDeleteBook(bookId) {
    deleteBook(bookId)
    renderBooks()
}

function onOpenBookDesc(bookId) {
    const book = getBookById(bookId)
    const elModal = document.querySelector('.modal')

    elModal.querySelector('.book-details-content').innerHTML = `
        <button class="close-btn" onclick="onCloseBookDesc()">X</button>
        <img src="${book.imgUrl}" alt="${book.title}" style="width: 100px;">
        <p><strong>Title:</strong> ${book.title}</p>
        <p><strong>Price:</strong> ${book.price} $</p>
        <p><strong>Description:</strong> ${book.desc}</p>
    `
    elModal.classList.add('open')
}

function onCloseBookDesc() {
    const elModal = document.querySelector('.modal')
    elModal.querySelector('.book-details-content').innerHTML = ''
    elModal.classList.remove('open')
}