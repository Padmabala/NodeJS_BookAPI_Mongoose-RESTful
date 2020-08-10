require('should');
const request=require('supertest');

const mongoose=require('mongoose');
const {Schema}=mongoose;
const bookModel=new Schema(
    {
        title:{type:String},
        author:{type:String},
        genre:{type:String},
        read:{type:Boolean,default:false}
    }
);
process.env.ENV='Test';
const app=require("../app.js");

const Book=mongoose.model('Book',bookModel);

const agent=request.agent(app);
process.env.ENV='Test';
describe('Book Crud Test',()=>{
    it('Should allow a book to be posted and return read and _id',(done)=>{
        const bookPost={title:'My Book',author:'Jon',genre:'Fiction'}
        agent.post('/api/books')
            .send(bookPost)
            .expect(200)
            .end((err,results)=>{
                //results.body.read.should.not.equal(false);
                results.body.should.have.property('_id');
                done();
            })
    });
    afterEach((done)=>{
        Book.deleteMany({}).exec();
        done();
    })
    after((done)=>{
        mongoose.connection.close();
        app.server.close(done());
    })
})