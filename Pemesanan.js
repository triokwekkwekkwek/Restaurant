const express = require('express');
const app = express()

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://amalja0:sokcantik@penjualan-rumah.jqla1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const dbName = 'Menu-Online-Restaurant'
let db = MongoClient.connection

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) return console.log(err)

    // Storing a reference to the database so you can use it later
    db = client.db(dbName)
    const pemesananCollection = db.collection('Pemesanan');
})

app.listen(3003, () => {
    console.log('Server running in 3003')
})

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    db.collection('Menu').find().toArray()
      .then(results => {
        res.render('pemesanan.ejs', { menu: results })
      })
      .catch(/* ... */)
})

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/pemesanan', (req, res) => {
    console.log(req)
    // var embeddedDocument = [];
    // var i;
    // for (i = 0; i < req.length; i++) {
    //     // embeddedDocument.push({  
    //     //     id_hidangan: {
    //     //         "$ref": "Menu",
    //     //         "$id": db.collection('Menu').find({"nama" : req.body.name})
    //     //     },
    //     //     kuantitas : req.body.value,
    //     //     status: false
    //     // })
    // }
    // var document = {_id: new require('mongodb').ObjectID, 
    //                 createdAt: new require('mongodb').Date,
    //                 pesanan: embeddedDocument,
    //             }
    // console.log(embeddedDocument)

    // menuCollection.insertOne(document)
    // .then(result => {
    //     res.redirect('/');
    // })
    // .catch(error => console.error(error))
})
