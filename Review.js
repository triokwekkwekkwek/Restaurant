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
    console.log('Server running in 3002');
})

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('review.ejs')
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

app.post('/pesan', (req, res) => {
    res.redirect('/pemesanan')
})

app.post('/pemesanan', (req, res) => {
    console.log(req.body);

    var count = Object.keys(req.body).length;
    console.log(count);
    var i;

    var reviews = [];
    var nama_hidangan = [];

    for (i = 0; i <  count; i++) {
        var embeddedDocument = [];
        var hidangan = req.body[i]['nama-hidangan'];
        nama_hidangan.push(hidangan);
        
        delete req.body[i]['nama-hidangan'];
        embeddedDocument = req.body[i];
        embeddedDocument.date = new Date();

        reviews.push(embeddedDocument);

        console.log(embeddedDocument);
    }

    console.log("Panjang review" + reviews.length);

    for (i = 0; i < count; i++) {
        console.log(nama_hidangan[i]);
        console.log(reviews[i]);

        add_review(nama_hidangan[i], reviews[i]);
    }

    res.redirect('/');
})

function add_review(nama_hidangan, review) {
        db.collection('Menu').find({nama: nama_hidangan}).toArray()
        .then(result => {
            console.log(result[0]);
            console.log(".........")
            var id_rev = get_id_review(result[0]);

            db.collection('Review').findOneAndUpdate(
                { _id : id_rev},
                { $push : {reviews:  review},
                  $inc : {count: 1}
                }
            )
            .then(rev_result => {
                console.log(rev_result.value);
                if (get_count(rev_result.value) == 9) {
                    console.log(result[0]);
                    var id_menu = get_id(result[0]);
                    var page = get_page_count(result[0]);
                    var id_review = generate_review_id(nama_hidangan, page);
    
                    var reviewDocument = { _id: id_review,
                               nama_hidangan: nama_hidangan,
                               count: 0,
                               date: new Date()
                    }

                    console.log(reviewDocument);
                    
                    db.collection('Review').insertOne( reviewDocument );
    
                    db.collection('Menu').update(
                        { _id : id_menu},
                        { $push : { id_reviews:  {page: page, id_review: id_review}},
                          $inc : {page_count:  1}
                        }
                    );
                }
            })
            .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
}

function get_page_count(object) {
    return object.page_count;
}

function get_id_review(object) {
    var nama = object.nama;
    var page = object.page_count - 1;
    var page_num = page.toString();

    nama = nama.replaceAll(" ", "_");
    page_num = "_" + page_num;

    return nama.concat(page_num);
}

function get_count(object) {
    return (object.count);
}

function get_id(object) {
    return (object._id);
}

function generate_review_id(nama_hidangan, page) {
    nama_hidangan = nama_hidangan.replaceAll(" ", "_");
    page = "_" + page.toString();

    return nama_hidangan.concat(page);
}