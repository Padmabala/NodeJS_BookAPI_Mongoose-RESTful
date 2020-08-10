const booksController=(Book)=>{
    const postBook=(req, res) => {
        const book = new Book(req.body);
        if(!req.body.title){
            res.status(400);
            return res.send('Title is required');
        }
        book.save();
        res.status(201);
        return res.json(book);
    }
    const getBooks=(req, res) => {
        const query = {};
        if (req.query.genre) {
            query.genre = req.query.genre
        }
        Book.find(query,
            (err, books) => {
                if (err) {
                    return res.send(err);
                }
                const returnBooks=books.map(book=>{
                    const newBook=book.toJSON();
                    newBook.links={}
                    newBook.links.self=`http://${req.headers.host}/api/books/${book._id}`;
                    return newBook;
                })
                return res.json(returnBooks);
            }
        );
    }
    const bookByIdMiddleware=(req,res,next)=>{
        Book.findById(req.params.bookId, (err, book) => {
            if (err) {
                return res.send(err);
            }
            if(book){
                console.log(book);
                req.book=book;
                return next();
            }
                return res.sendStatus(404);
            });
        }
    const updateBook=(req,res)=>{
        const {book}=req;
            book.title=req.body.title;
            book.genre=req.body.genre;
            book.author=req.body.author;
            book.read=req.body.read;
            req.book.save((err)=>{
                if(err){
                    return res.send(err);
                }
                return res.status(201).json(book);
            });
        }
    const updateBookAttributes=(req,res)=>{
        const {book}=req;
        if(req.body._id){
            delete req.body._id;
        }
        Object.entries(req.body).forEach(item=>{
            const key=item[0];
            const value=item[1];
            book[key]=value;
        });
        req.book.save((err)=>{
            if(err){
                return res.send(err);
            }
            return res.status(201).json(book);
        });            
    }
    const removeBook=(req,res)=>{
        req.book.remove((err,book)=>{
            if(err){
                return res.send(err);
            }
            res.sendStatus(204);
        })
    }
    return {postBook,getBooks,bookByIdMiddleware,updateBook,updateBookAttributes,removeBook};
}
module.exports=booksController;