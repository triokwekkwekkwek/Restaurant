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

app.listen(3001, () => {
    console.log('Server running in 3001')
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
    var count = Object.keys(req.body).length;
    var embeddedDocument = [];
    var i;

    for (i = 0; i <  count; i++) {
        embeddedDocument.push({  
            nama : req.body[i]['nama-hidangan'],
            kuantitas : parseInt(req.body[i]['kuantitas']),
        })
    }

    var document = {_id: new require('mongodb').ObjectID,
                    alias_name: createAlias(),
                    createdAt: new Date(),
                    pesanan: embeddedDocument,
                    status: false
    }

    db.collection('Pemesanan').insertOne(document)
    .then(result => {
        res.redirect('/');
    })
    .catch(error => console.error(error))
})

function createAlias() {
    const characters ='abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < 5; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}