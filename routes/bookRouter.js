const express = require('express');

const booksController=require("../controllers/booksController");

const router = (Book) => {
    const bookRouter = express.Router();
    const {getBooks,postBook,bookByIdMiddleware,updateBook,updateBookAttributes,removeBook}=booksController(Book);
    bookRouter.route('/books')
        .get(getBooks)
        .post(postBook)
    bookRouter.use('/books/:bookId',bookByIdMiddleware);
    bookRouter.route('/books/:bookId')
        .get((req, res) => {
            const returnBook=req.book.toJSON();
            const genre=req.book.genre.replace(' ','%20');
            returnBook.links={};
            returnBook.links.FilterByThisGenre=`http://${req.headers.host}/api/books/?genre=${genre}`
            res.json(returnBook);
            //res.json(req.book);
        })
        .put(updateBook)
        .patch(updateBookAttributes)
        .delete(removeBook)

    return bookRouter;
}

module.exports = router;