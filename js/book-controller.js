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
            <td>${book.price}</td>
            <td>
                <button class="read-btn" onclick="onReadBook('${book.id}')">Read</button>
                <button class="update-btn" onclick="onUpdateBook('${book.id}')">Update</button>
                <button class="delete-btn" onclick="onDeleteBook('${book.id}')">Delete</button>
            </td>
    </tr>
        `
    }).join('')
    document.querySelector('.books-list').innerHTML = strHTMLs
}

function onDeleteBook(bookId) {
    deleteBook(bookId)
    renderBooks()
}

function onUpdateBook(bookId) {
    const newPrice = +prompt('Enter new price:')
    if (!newPrice || newPrice < 0) return
    updatePrice(bookId, newPrice)
    renderBooks()
}