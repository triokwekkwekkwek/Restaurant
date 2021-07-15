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

app.listen(3001, () => {
    console.log('Server running in 3001')
})

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    db.collection('Menu').find().toArray()
      .then(results => {
        res.render('menu.ejs', { menu: results })
      })
      .catch(/* ... */)
})

app.get('/pemesanan', (req, res) => {
    db.collection('Menu').find().toArray()
      .then(results => {
        res.render('pemesanan.ejs', { menu: results })
      })
      .catch(/* ... */)
})

app.post('/review', (req, res) => {
    console.log(req.body);
    db.collection('Review').find(
        {nama_hidangan: req.body.name,
        reviews: { $exists: true }}
    ).toArray()
    .then(results => {
      console.log(JSON.stringify(results, null, 4));
      res.render('menu-review.ejs', { review: results })
    })
    .catch(/* ... */)
})

app.post('/review/review-by-rating', (req, res) => {
    var reviews = [];

    getStat(req);
    console.log(req.body);
    db.collection('Review').aggregate([
        { "$match" : { "nama_hidangan" : req.body.nama_hidangan}},
        { "$unwind" : "$reviews"},
        { "$match" : { "reviews.rating" : parseInt(req.body.rating)}}
    ])
      .toArray()
      .then(results => {
          console.log(JSON.stringify(results, null, 4));
          if (results.length == 0) {
              reviews.push({"nama_hidangan": req.body.nama_hidangan})
              res.render('menu-reviews-by-rating.ejs', { review: reviews})
          }
          else {
            res.render('menu-reviews-by-rating.ejs', { review: results})
          }
      })
      .catch(/* ... */)
})

app.get('/review', (req, res) => {
    res.redirect('..');
})

app.get('/review/review-by-rating', (req, res) => {
    res.redirect('/../review');
})

app.post('/pemesanan', (req, res) => {
    var count = Object.keys(req.body).length;
    var embeddedDocument = [];
    var i;

    for (i = 1; i < count ; i++) {
        embeddedDocument.push({  
            nama : req.body[i]['nama_hidangan'],
            kuantitas : parseInt(req.body[i]['kuantitas']),
        })
    }

    var document = {_id: new require('mongodb').ObjectID,
                    alias_name: req.body[0]['alias_name'],
                    createdAt: new Date(),
                    pesanan: embeddedDocument,
                    status: false
    }

    db.collection('Pemesanan').insertOne(document)
    .then(result => {
        order_alias = req.body[0]['alias_name'];
    })
    .catch(error => console.error(error))
})


app.post('/cek_status_pembayaran', (req, res) => {
    if (order_alias != " "){
        console.log(order_alias);
        res.redirect('/receipt');
    }
    else {
        console.log("order tidak ada");
    }
})

app.get('/receipt', (req, res) => {
    res.render('receipt.ejs', {message: order_alias});
})

function getStat(req){
    db.collection('Review').aggregate([
        { "$match" : { "nama_hidangan" : req.body.nama_hidangan}},
        { "$unwind" : "$reviews"},
        { "$match" : { "reviews.rating" : parseInt(req.body.rating)}}
    ])
    .explain("executionStats")
    .then((result) => {
        console.log(result);
        console.log("--------------------");
    })
}