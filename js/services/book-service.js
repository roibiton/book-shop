'use strict'

var gBooks
const STORAGE_KEY = 'bookDB'


_createBooks()
console.log('gBooks:', gBooks)


function getBooksForDisplay(options = {}) {
    const filterBy = options.filterBy
    const sortBy = options.sortBy
    const page = options.page

    var filteredBooks = _filterBooks(gBooks, filterBy)

    if (sortBy.title) {
        const sortDir = sortBy.title
        filteredBooks = filteredBooks.toSorted((b1, b2) => b1.title.localeCompare(b2.title) * sortDir)
    }

    if (sortBy.price) {
        const sortDir = sortBy.price
        filteredBooks = filteredBooks.toSorted((b1, b2) => (b1.price - b2.price) * sortDir)
    }
    if (sortBy.rate) {
        const sortDir = sortBy.rate
        filteredBooks = filteredBooks.toSorted((b1, b2) => (b1.rate - b2.rate) * sortDir)
    }

    const startIdx = page.idx * page.size // 0 , 3 , 6
    const endIdx = startIdx + page.size // 3 , 6 , 9

    filteredBooks = filteredBooks.slice(startIdx, endIdx)

    return filteredBooks
}

function getBookById(bookId) {
    return gBooks.find(book => book.id === bookId)
}

function getBookStat(statMode) {
    if (statMode === 'expensive') {
        return gBooks.filter(book => book.price > 200).length
    }
    if (statMode === 'average') {
        return gBooks.filter(book => book.price < 200 && book.price > 80).length
    }
    if (statMode === 'cheap') {
        return gBooks.filter(book => book.price < 80).length
    }

}

function _createBooks() {
    gBooks = loadFromStorage(STORAGE_KEY)

    if (!gBooks || !gBooks.length) {
        gBooks = [
            _createBook('The Adventures of Lori Ipsi'),
            _createBook('World Atlas'),
            _createBook('Zorba the Greek', 87),
        ]
        _saveBooks()
    }
}

function _createBook(title, price, rate) {
    return {
        id: makeId(),
        title,
        price: price || getRandomInt(20, 300),
        rate: rate || getRandomInt(1, 6),
        imgUrl: `img/0${getRandomInt(1, 6)}.jpg`,
        desc: makeLorem(50)
    }
}

function deleteBook(bookId) {
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(bookIdx, 1)
    _saveBooks()
}

function _filterBooks(books, filterBy) {
    if (filterBy.txt) {
        books = books.filter(book => book.title.toLowerCase().includes(filterBy.txt.toLowerCase()))
    }
    if (filterBy.minRate) {
        books = books.filter(book => book.rate >= filterBy.minRate)
    }
    return books
}

function updatePrice(bookId, newPrice) {
    const book = gBooks.find(book => book.id === bookId)
    book.price = newPrice
    _saveBooks()
}
function updateTitle(bookId, newTitle) {
    const book = gBooks.find(book => book.id === bookId)
    book.title = newTitle
    _saveBooks()
}
function updateRate(bookId, rate) {
    if (rate <= 0 || rate > 5) return
    const book = gBooks.find(book => book.id === bookId)
    book.rate = rate
    _saveBooks()
}

function addBook(title, price, rate) {
    const newBook = _createBook(title, price, rate)
    gBooks.push(newBook)
    _saveBooks()
}

function makeId() {
    return `t${getRandomInt(100, 999)}`
}

function _saveBooks() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}