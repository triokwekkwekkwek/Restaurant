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

app.listen(3004, () => {
    console.log('Server running in 3004')
})

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    getStat();
    db.collection('Pemesanan').aggregate([
        {
            '$facet': 
            {
                'Terbayar': 
                [
                    {
                        '$match': {
                        'status': true
                        }
                    }, 
                    {
                        '$count': 'dibayar'
                    }
                ], 
                'Direview': 
                [
                    {
                        '$match': {
                        'review_status': true
                        }
                    }, 
                    {
                        '$count': 'direview'
                    }
                ]
            }
        }
    ])
    .toArray()
    .then((result) => {

        db.collection('Pemesanan').aggregate([
            { $match: { 'status': true }},
            { $unwind : "$pesanan"},
            {
                $group: {
                  _id: "$pesanan.nama",
                  jumlah: {
                    $sum: "$pesanan.kuantitas"
                  }
                }
            }
        ])
        .toArray()
        .then((penjualan_result) => {
            console.log(JSON.stringify(penjualan_result, null, 4))
            var total_pembayaran;
            var total_review;
            var tanggal = new Date();
            tanggal = tanggal.toDateString();

            if (result[0]['Terbayar'][0] == undefined) {
                total_pembayaran = 0
            } else {
                total_pembayaran = total_pembayaran = result[0]['Terbayar'][0]['dibayar'];
            }
        
            if (result[0]['Direview'][0] == undefined) {
                total_review = 0
            }
            else {
                total_review = result[0]['Direview'][0]['direview'];
            }

            res.render('daily-report.ejs', { tanggal: tanggal, review_count: total_review, paid_count: total_pembayaran, penjualan:  penjualan_result});
            });
        })
        .catch(/* ... */)
})

function getStat(){
    db.collection('Pemesanan').aggregate([
        {
            '$facet': 
            {
                'Terbayar': 
                [
                    {
                        '$match': {
                        'status': true
                        }
                    }, 
                    {
                        '$count': 'dibayar'
                    }
                ], 
                'Direview': 
                [
                    {
                        '$match': {
                        'review_status': true
                        }
                    }, 
                    {
                        '$count': 'direview'
                    }
                ]
            }
        }
    ])
    .explain("executionStats")
    .then((result) => {
        console.log(result);
        console.log("--------------------");
    })
}