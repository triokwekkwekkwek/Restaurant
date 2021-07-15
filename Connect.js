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
    getStat();
    db.collection('Review').aggregate([
        {
            $lookup:
              {
                from: "Menu",
                localField: "nama_hidangan",
                foreignField: "nama",
                as: "menu"
              }
        },
        {
            $project: {
               "nama_hidangan": 1,
               "menu.jenis": 1,
               "menu.deskripsi": 1,
               "menu.harga": 1,
               "reviews": { $ifNull: [ "$reviews", { "rating": 0 } ] }
            }
        },
        { "$unwind" : "$reviews"},
        {
            $group: {
              _id: "$nama_hidangan",
              jenis: {
                $first: "$menu.jenis"
              },
              deskripsi: {
                $first: "$menu.deskripsi"
              },
              harga: {
                $first: "$menu.harga"
              },
              ratingAvg: {
                $avg: "$reviews.rating"
              }
            }
        },
        { $set: { ratingAvg: { $round: [ "$ratingAvg", 2 ] } } }
    ])
    .toArray()
    .then(rev_results => {
        console.log(JSON.stringify(rev_results, null, 4));
        res.render('index.ejs', { menu: rev_results});
    })
    .catch( /* ... */ );
})

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(express.static(__dirname + '/views'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/menu', (req, res) => {
    var nama = req.body.nama;
    var id = new require('mongodb').ObjectID;
    var document = {
        _id: id,
        jenis: parseInt(req.body.jenis),
        nama: nama,
        deskripsi: req.body.deskripsi,
        harga: parseInt(req.body.harga),
        page_count: 1
    }

    db.collection('Menu').insertOne(document)
        .then(result => {
            res.redirect('/');
        })
        .catch(error => console.error(error));

    var reviewDocument = {
        _id: generate_review_id(nama.replaceAll(" ", "_"), "_0"),
        nama_hidangan: nama,
        count: 0,
        date: new Date()
    }
    db.collection('Review').insertOne(reviewDocument)
})

function generate_review_id(nama_hidangan, page) {
    return nama_hidangan.concat(page);
}

app.post('/menu-update', (req, res) => {
    db.collection('Menu').findOneAndUpdate({ nama: req.body.nama }, {
            $set: {
                deskripsi: req.body.deskripsi,
                harga: req.body.harga
            }
        })
        .then(result => {
            res.redirect('/');
            console.log(result);
        })
        .catch(error => console.error(error));
})

app.delete('/menu', (req, res) => {
        db.collection('Menu').deleteOne({ nama: req.body.nama });
        db.collection('Review').deleteMany({ nama_hidangan: req.body.nama });
})

function delete_review(id_review) {
    db.collection('Review').deleteOne({ _id: id_review })
}

function get_all_review(object) {
    return object.id_reviews;
}

function getStat(){
    db.collection('Review').aggregate([
        {
            $lookup:
              {
                from: "Menu",
                localField: "nama_hidangan",
                foreignField: "nama",
                as: "menu"
              }
        },
        {
            $project: {
               "nama_hidangan": 1,
               "menu.jenis": 1,
               "menu.deskripsi": 1,
               "menu.harga": 1,
               "reviews": { $ifNull: [ "$reviews", { "rating": 0 } ] }
            }
        },
        { "$unwind" : "$reviews"},
        {
            $group: {
              _id: "$nama_hidangan",
              jenis: {
                $first: "$menu.jenis"
              },
              deskripsi: {
                $first: "$menu.deskripsi"
              },
              harga: {
                $first: "$menu.harga"
              },
              ratingAvg: {
                $avg: "$reviews.rating"
              }
            }
        },
        { $set: { ratingAvg: { $round: [ "$ratingAvg", 2 ] } } }
    ])
    .explain("executionStats")
    .then((result) => {
        console.log(result);
        console.log("--------------------");
    })
}
