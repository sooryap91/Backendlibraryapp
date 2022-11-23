const express = require('express')
const app = new express();
app.use(express.urlencoded({extended:true}))
app.use(express.json());
const cors = require('cors')
const logger = require('morgan')
app.use(cors())
const bodyParser = require("body-parser")
const path = require('path');
app.use(express.static('./dist/libraryapp'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'))
require('./middleware/mongodb') //to init mongoDB
// var bookid = require('mongodb').bookid
// bookid = (req.params.id).trim();
// bookid =  await deleteOne({_id:new mongodb.ObjectId(id)});
const api = require('./routes/api')
app.use('/api',api)

app.get('/api/book', async (req, res) => {

    try {

        const list = await DATA.find()
        res.send(list)


    } catch (error) {
        console.log(error)
    }

})
app.put('/api/updatebook', async (req, res) => {
    try {

        let id = req.body._id
        let item = {  //to fetch and save data from front end in server
            bookname: req.body.bookname,
            author: req.body.author
        }
        let updateData = { $set: item }
        let updatebook1 = await DATA.findByIdAndUpdate({ _id: id }, updateData)
        res.send(updatebook1)
    } catch (error) {
        console.log(error)

    }
})
app.post('/api/addbook', async (req, res) => {
    try {

        console.log(req.body)
        let item = {  //to fetch and save data from front end in server
            bookname: req.body.bookname,
            author: req.body.author
        }


        const newbook = new DATA(item) //to check incoming data
        const savebook = await newbook.save() //mongoDB save

        res.send(savebook)


    } catch (error) {

        console.log(error)
    }
})


app.get('/api/singlebook/:id', async (req, res) => {

    try {

        let data = await DATA.findById({"_id":req.params})
        res.send(data)


    } catch (error) {
        console.log(error)
    }

})

app.delete('/api/book/:id', async (req, res) => {
    try {
        let id = req.params._id
        const deletebook = await DATA.deleteOne(({ _id: req.params.id })
        )
        res.send(deletebook)



    } catch (error) {
        console.log(error)

    }
})






   
   

app.post('/api/signup', async (req, res) => {
    try {
        let item = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
        const newuser = new DATA(item)
        const saveuser = await newuser.save()
        res.send(saveuser)


    } catch (error) {
        console.log(error)
    }
})
app.post('/api/login', async (req, res) => {
    try {
        let user = await DATA.findOne({
            email: req.body.email,
            password: req.body.password
        })
        if (!user) {
            return res.json({ message: "Invalid credentials" });
        }
        res.send(user)

    } catch (error) {
        console.log(error)
    }
})


    


app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/libraryapp/index.html'));
   });


app.listen(3000,()=>{
    console.log("Server is listening")
})