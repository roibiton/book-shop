'use strict'

const gQueryOptions = {
    filterBy: { title: '', minRate: 0 },
    sortBy: {},
    page: { idx: 0, size: 5 }
}
var gDirection = true // true - asc , false - desc

function onInit() {
    readQueryParams()
    renderBooks()
}

function renderBooks() {
    const books = getBooksForDisplay(gQueryOptions)
    var strHTMLs = `
    <thead>
            <tr>
                <th>ID</th>
                <th onclick="onSort('title', ${gDirection})">Title</th>
                <th onclick="onSort('rate', ${gDirection})">Rate</th>
                <th onclick="onSort('price', ${gDirection})">Price</th>
                <th>Actions</th>
            </tr>
    </thead>`
    if (books.length !== 0) {
        strHTMLs += books.map(book => {
            return `
            <tr class="book-item">
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${getRateDisplay(book.rate)}</td>
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
    else {
        strHTMLs = `<h3>no matching books were found...</h3>`
        document.querySelector('.books-list').innerHTML = strHTMLs


    }
    renderStat()
}

function renderStat() {
    document.querySelector('.total-expensive-count').innerText = getBookStat('expensive')
    document.querySelector('.total-average-count').innerText = getBookStat('average')
    document.querySelector('.total-cheap-count').innerText = getBookStat('cheap')
}

function onOpenUpdateModal(bookId) {
    const book = getBookById(bookId)
    const elUpdateModal = document.querySelector('.update-modal')
    elUpdateModal.innerHTML = `<div class="update-content">
            <form class="book-update" onsubmit="onUpdateBook(event, '${bookId}')">
                <button class="close-btn" onclick="onCloseBookUpdate(event)">X</button>
                <input value="${book.title}" type="text" name="title-update-from-modal" />
                <div style="display:flex; gap:1em;">
                    <input value="${book.price}" type="number" class="book-price-update" name="price-update-from-modal" />
                    <input value="${book.rate}" type="number" class="book-rate-update" name="rate-update-from-modal" />
                </div>
                <button class="btn">Update</button>
            </form>
        </div>`

    elUpdateModal.classList.add('open')
}

function onUpdateBook(ev, bookId) {
    ev.preventDefault()
    document.querySelector('.update-modal').classList.remove('open')
    const title = document.querySelector('[name="title-update-from-modal"]').value
    const newPrice = document.querySelector('[name="price-update-from-modal"]').value
    const newRate = document.querySelector('[name="rate-update-from-modal"]').value

    if (!newPrice || newPrice < 0 || !title.length || title.length === 0 || newRate < 0 || newRate > 5) {
        alert('Eror!\npls update both fields with valid values')
        return
    }
    updatePrice(bookId, newPrice)
    updateTitle(bookId, title)
    updateRate(bookId, newRate)

    renderBooks()
    onOpenMsgModal('updated', 'yellow')
}

function onCloseBookUpdate(ev) {
    ev.preventDefault()
    document.querySelector('.update-modal').classList.remove('open')
}

function onOpenAddBookModal() {
    const elUpdateModal = document.querySelector('.update-modal')
    elUpdateModal.innerHTML = `<div class="update-content">
            <form class="book-update" onsubmit="onAddBook(event)">
                <button class="close-btn" onclick="onCloseBookAdd(event)">X</button>
                <input placeholder="Title" type="text" name="book-title-add" />
                <div style="display:flex; gap:1em;">
                    <input placeholder="Price" type="number" class="book-price-update" name="book-price-add" />
                    <input placeholder="Rate" type="number" class="book-rate-update" name="book-rate-add" />
                </div>
                <button class="btn">Add</button>
            </form>
        </div>`

    elUpdateModal.classList.add('open')
}

function onAddBook(ev) {
    ev.preventDefault()
    const title = document.querySelector('[name="book-title-add"]').value
    const price = +document.querySelector('[name="book-price-add"]').value
    const rate = +document.querySelector('[name="book-rate-add"]').value
    if (!price || price < 0 || !title.length || title.length === 0 || rate < 0 || !rate || rate > 5) {
        alert('Eror!\npls fill all fields with values,\nbefoure adding a new book.')
        return
    }
    addBook(title, price, rate)
    renderBooks()
    onOpenMsgModal('added', 'lightgreen')
    document.querySelector('.update-modal').classList.remove('open')
}

function onCloseBookAdd(ev) {
    ev.preventDefault()
    document.querySelector('.update-modal').classList.remove('open')
}

function onDeleteBook(bookId) {
    deleteBook(bookId)
    renderBooks()
    onOpenMsgModal('deleted', 'red')
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
        
    <div style="display: flex; gap: 5px;">
       <button onclick="onUpdateRate('${bookId}', -1)">-</button>
       <strong>${book.rate}</strong>
       <button onclick="onUpdateRate('${bookId}', 1)">+</button>
    </div>
        `
    elModal.classList.add('open')
}

function onUpdateRate(bookId, diff) {
    const book = getBookById(bookId)
    updateRate(bookId, diff + book.rate)
    updateTxt(bookId)
    renderBooks()
}

function updateTxt(bookId) {
    const book = getBookById(bookId)
    const elModal = document.querySelector('.modal')
    elModal.querySelector('.book-details-content div strong').innerText = book.rate
}

function onCloseBookDesc() {
    const elModal = document.querySelector('.modal')
    elModal.querySelector('.book-details-content').innerHTML = ''
    elModal.classList.remove('open')
}

function onOpenMsgModal(msg, txtColor) {
    const elMsgModal = document.querySelector('.msg-modal span')
    elMsgModal.innerText = msg
    elMsgModal.style.color = txtColor
    document.querySelector('.msg-modal').classList.add('open')
    setTimeout(onCloseMsgModal, 2000)
}

function onCloseMsgModal() {
    document.querySelector('.msg-modal').classList.remove('open')
}

function onSetFilterBy(filterBy) {
    if (filterBy.title !== undefined) {
        gQueryOptions.filterBy.title = filterBy.title
    } else if (filterBy.minRate !== undefined) {
        gQueryOptions.filterBy.minRate = filterBy.minRate
    }
    console.log('gQueryOptions.filterBy:', gQueryOptions.filterBy)

    gQueryOptions.page.idx = 0
    setQueryParams()
    renderBooks()
}

function onSetSortBy() {
    const elSortField = document.querySelector('.sort-by select')
    const elSortDir = document.querySelector('.sort-desc')
    const sortField = elSortField.value
    const sortDir = (elSortDir.checked) ? -1 : 1
    console.log('sortDir:', sortDir)
    gQueryOptions.sortBy = { [sortField]: sortDir }
    gQueryOptions.page.idx = 0
    setQueryParams()
    renderBooks()
}

function onSort(sortBy, direction) {
    gDirection = !gDirection
    const sortDir = (direction) ? 1 : -1
    gQueryOptions.sortBy = { [sortBy]: sortDir }
    gQueryOptions.page.idx = 0
    setQueryParams()
    renderBooks()
}

function onNextPage() {
    const pageCount = getPageCount(gQueryOptions)
    if (gQueryOptions.page.idx === pageCount - 1) {
        gQueryOptions.page.idx = 0
    } else {
        gQueryOptions.page.idx++
    }
    setQueryParams()
    renderBooks()
}

function onPrevPage() {
    const pageCount = getPageCount(gQueryOptions)
    if (gQueryOptions.page.idx === 0) {
        gQueryOptions.page.idx = pageCount - 1
    } else {
        gQueryOptions.page.idx--
    }
    setQueryParams()
    renderBooks()
}

function readQueryParams() {
    const queryParams = new URLSearchParams(window.location.search)

    gQueryOptions.filterBy = {
        title: queryParams.get('title') || '',
        minRate: +queryParams.get('minRate') || 0,
    }

    if (queryParams.get('sortBy')) {
        const field = queryParams.get('sortBy')
        const dir = queryParams.get('sortDir')
        gQueryOptions.sortBy = { [field]: dir }
    }

    gQueryOptions.page = {
        idx: +queryParams.get('pageIdx') || 0,
        size: +queryParams.get('pageSize') || 5
    }
    renderQueryParams()
}

function renderQueryParams() {
    document.querySelector('.book-filter-input').value = gQueryOptions.filterBy.title
    const elMinRate = document.querySelector('.book-filter-min-rate')
    if (elMinRate) {
        elMinRate.value = gQueryOptions.filterBy.minRate
    }

    const sortKeys = Object.keys(gQueryOptions.sortBy)
    if (sortKeys.length) {
        const sortBy = sortKeys[0]
        const dir = gQueryOptions.sortBy[sortKeys[0]]

        document.querySelector('.sort-by select').value = sortBy || ''
        document.querySelector('.sort-by .sort-desc').checked = (dir === '-1') ? true : false
    }
}

function setQueryParams() {
    const queryParams = new URLSearchParams()

    queryParams.set('title', gQueryOptions.filterBy.title)
    queryParams.set('minRate', gQueryOptions.filterBy.minRate)

    const sortKeys = Object.keys(gQueryOptions.sortBy)
    if (sortKeys.length) {
        queryParams.set('sortBy', sortKeys[0])
        queryParams.set('sortDir', gQueryOptions.sortBy[sortKeys[0]])
    }

    queryParams.set('pageIdx', gQueryOptions.page.idx)
    queryParams.set('pageSize', gQueryOptions.page.size)

    const newUrl =
        window.location.protocol + "//" +
        window.location.host +
        window.location.pathname + '?' + queryParams.toString()

    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onResetActions() {
    gQueryOptions.filterBy = { title: '', minRate: 0 }
    gQueryOptions.sortBy = {}
    gQueryOptions.page = { idx: 0, size: 5 }

    document.querySelector('.book-filter-input').value = ''
    const elMinRate = document.querySelector('.book-filter-min-rate')
    if (elMinRate) {
        elMinRate.value = 0
    }
    document.querySelector('.sort-by select').value = ''
    document.querySelector('.sort-by .sort-desc').checked = false

    setQueryParams()
    renderBooks()
}

function getRateDisplay(length) {
    var str = ''
    for (var i = 0; i < length; i++) {
        str += '⭐'
    }
    return str
}

