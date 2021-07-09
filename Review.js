const express = require('express');
const app = express()

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://amalja0:sokcantik@penjualan-rumah.jqla1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const pemesanan = []

const dbName = 'Menu-Online-Restaurant'
let db = MongoClient.connection
var list_pesanan = [];

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) return console.log(err)

    // Storing a reference to the database so you can use it later
    db = client.db(dbName)
    const reviewCollection = db.collection('Review');
})

app.listen(3002, () => {
    console.log('Server running in 3001');
})

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('review.ejs')
})

app.get('/list-pemesanan', (req, res) => {
    db.collection('Pemesanan').find().toArray()
    .then(results => {
         console.log(results)
         res.json(results)
     }).catch(/* ... */)
})

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/', (req, res) => {
    console.log(typeof req.body.alias);
    db.collection('Pemesanan').find({alias_name: req.body.alias}).toArray()
    .then(results => {
        console.log(results)
        list_pesanan = results;
    })
    .catch(/* ... */)
    res.redirect('/');
})

app.get('/pemesanan', (req, res) => {
    if (list_pesanan.length != 0) {
        res.render('add_review.ejs', {pesanan: list_pesanan})
    }
    else {
        res.send("Maaf, tidak ada pesanan pada nomor ini")
    }
})

app.post('/pemesanan', (req, res) => {
    res.redirect('/pemesanan')
})

// app.post('/pesanan', (req, res) => {
//     db.collection('Pemesanan').find({alias_name: req.body.alias}).toArray()
//     .then(results => {
//         console.log(results)
//         list_pesanan = results;

//         res.render('add_review.ejs', {pesanan: list_pesanan})
//     })
//     .catch(/* ... */)
//     res.redirect('/pesanan');
// })

// function render_add_review(list) {
//     app.get('/pesanan', (req, res) => {
//         res.render('add_review.ejs', {pesanan: list})
//     })
// }

// app.post('/pesanan', (req, res) => {
//         db.collection('Pemesanan').find({alias_name: req.body.alias}).toArray()
//         .then(results => {
//             console.log(results)
//             list = results;

//             render_add_review(list)
//         }).catch(/* ... */);
//         res.redirect('/pesanan')
// })



