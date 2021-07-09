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
    const menuCollection = db.collection('Menu');
    const reviewCollection = db.collection('Review');
})

app.listen(3000, () => {
    console.log('Server running in 3000')
})

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    db.collection('Menu').find().toArray()
      .then(results => {
        res.render('index.ejs', { menu: results })
      })
      .catch(/* ... */)
})

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/menu', (req, res) => {
    var nama = req.body.nama;
    var id = new require('mongodb').ObjectID;
    var id_review = new require('mongodb').ObjectID;
    var document = {_id: id, 
                    jenis: parseInt(req.body.jenis),
                    nama: nama,
                    deskripsi: req.body.deskripsi,
                    harga: parseInt(req.body.harga),
                    page_count: 1,
                    id_reviews: [{  page: 0,
                                    id_review: generate_review_id(nama.replace(" ", "_"), "_0") }]
                }

    db.collection('Menu').insertOne(document)
    .then(result => {
        res.redirect('/');
    })
    .catch(error => console.error(error));

    var reviewDocument = { _id: generate_review_id(nama.replace(" ", "_"), "_0"),
                           nama_hidangan: nama,
                           count: 0,
                           date: new Date()
                        }
    db.collection('Review').insertOne(reviewDocument)
})

function generate_review_id(nama_hidangan, page) {
    return nama_hidangan.concat(page);
}

app.get('/', (req, res) => {
    db.collection('Menu').find().toArray()
    .then(results => {
        console.log(results)
    })
    .catch(error => console.error(error))
})

app.post('/menu-update', (req, res) => {
    db.collection('Menu').findOneAndUpdate( 
        {nama: req.body.nama},
        {
            $set: {
                deskripsi: req.body.deskripsi,
                harga: req.body.harga
            }
        }
    )
    .then(result => {
        res.redirect('/');
        console.log(result);
    })
    .catch(error => console.error(error));
})
app.delete('/menu', (req, res) => {
    db.collection('Menu').deleteOne(
      { nama: req.body.nama }
    )
    .then(result => {
        res.redirect('/');
        console.log(result);
      })
    .catch(error => console.error(error));
})

