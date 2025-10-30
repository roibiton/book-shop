'use strict'

var gBooks
var gFilterBy = 'all'
const STORAGE_KEY = 'bookDB'


_createBooks()
console.log('gBooks:', gBooks)


function getBooksForDisplay() {
    if (gFilterBy === 'all') return gBooks

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
    }
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