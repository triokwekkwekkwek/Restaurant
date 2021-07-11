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
        // list_pesanan = results
        if(results[0]['status'] === true) {
            list_pesanan = results;
        }
        else {
            console.log("belum bayar");
        }  
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
    var i;

    for (i = 0; i <  count; i++) {
        var embeddedDocument = [];
        var hidangan = req.body[i]['nama-hidangan'];
        
        delete req.body[i]['nama-hidangan'];
        embeddedDocument = req.body[i];
        embeddedDocument.date = new Date();

        console.log(i);
        console.log(hidangan);
        console.log(embeddedDocument);

        db.collection('Menu').find({nama: hidangan}).toArray()
        .then(result => {
            console.log(result[0]);
            console.log(".........")
            var id_rev = get_id_review(result[0]);
            console.log(id_rev);
            db.collection('Review').update(
                { _id : id_rev},
                { $inc : {"count":  1}},
                { $push : {"reviews":  embeddedDocument}}
            )
            
            // if (get_count(result[0]) == 9) {
            //     var id_menu = get_id(result);
            //     var page = get_page_count(result);
            //     var id_review = generate_review_id(hidangan, page);
            //     db.collection('Menu').findOneAndUpdate(
            //         { _id : id_menu},
            //         { $push : { id_reviews:  id_review}},
            //         { $inc : {page_count:  1}}
            //     );
            // }
        })
        .catch(error => console.error(error))
           
    }
    res.redirect('/')
})

function get_page_count(object) {
    return object,page_count;
}

function get_id_review(object) {
    var nama = object.nama;
    var page = object.page_count - 1;
    var page_num = page.toString();

    nama = nama.replace(" ", "_");
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
    return nama_hidangan.concat(page);
}



