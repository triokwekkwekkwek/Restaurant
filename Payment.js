const express = require('express');
const app = express()

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://amalja0:sokcantik@penjualan-rumah.jqla1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const dbName = 'Menu-Online-Restaurant'
let db = MongoClient.connection

var order_alias = "";

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

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    db.collection('Pemesanan').find().toArray()
      .then(results => {
        res.render('payment.ejs', { list_pesanan: results })
       })
    //   .catch(/* ... */)
})

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/check_order', (req, res) => {
    console.log(req.body.alias_name);
    db.collection('Pemesanan').findOneAndUpdate({ alias_name: req.body.alias_name }, {
        $set: {
           status: true
        }
    })
    .then(result => {
        res.redirect('/');
        console.log(result);
    })
    .catch(error => console.error(error));
})