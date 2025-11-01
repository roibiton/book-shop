'use strict'

var gBooks
var gFilterBy = ''
const STORAGE_KEY = 'bookDB'


_createBooks()
console.log('gBooks:', gBooks)


function getBooksForDisplay() {
    if (!gFilterBy) return gBooks

    const filteredBooks = gBooks.filter(book => {
        return book.title.toLowerCase().includes(gFilterBy.toLowerCase())
    })
    return filteredBooks
}

function setBookFilter(filterBy) {
    gFilterBy = filterBy
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
            _createBook('The Adventures of Lori Ipsi', 120),
            _createBook('World Atlas', 300),
            _createBook('Zorba the Greek', 87),
        ]
        _saveBooks()
    }
}

function _createBook(title, price) {
    return {
        id: makeId(),
        title,
        price,
        imgUrl: `img/0${getRandomInt(1, 6)}.jpg`,
        desc: makeLorem(50)
    }
}

function deleteBook(bookId) {
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(bookIdx, 1)
    _saveBooks()
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

function addBook(title, price) {
    const newBook = _createBook(title, price)
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