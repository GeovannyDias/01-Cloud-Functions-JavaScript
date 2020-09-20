// const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// var serviceAccount = require('./permissions.json');
// // var serviceAccount = require("path/to/serviceAccountKey.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://roti-grille.firebaseio.com"
// });

admin.initializeApp(functions.config().firebase);

const express = require('express');
const app = express();
const db = admin.firestore();

const cors = require('cors');
app.use(cors({ origin: true }));

// Routes
app.get('/hello-world', (req, res) => {
    return res.status(200).send('Hola Mundo!');
});

// Create (Post)
app.post('/api/create', (req, res) => {
    (async () => {
        try {
            // const id = db.createId();
            // .doc('/'+req.body.id+'/')
            // await 
            await db.collection('products').doc('/' + req.body.id + '/').create({
                id: req.body.id,
                name: req.body.name,
                description: req.body.description,
                price: req.body.price
            });
            return res.status(200).send('Post Completed...');
        } catch (error) {
            console.log('Error create:', error)
            return res.status(500).send(error);
        }
    })();
});

// Read (Get) a specific product based on ID
app.get('/api/read/:id', (req, res) => {
    (async () => {
        try {
            // const id = db.createId();
            // .doc('/'+req.body.id+'/')
            // await 
            const document = db.collection('products').doc(req.params.id);
            let product = await document.get();
            let response = product.data();

            return res.status(200).send(response);
        } catch (error) {
            console.log('Error create:', error)
            return res.status(500).send(error);
        }
    })();
});

// Read (Get) all items
app.get('/api/read', (req, res) => {
    (async () => {
        try {

            let query = db.collection('products');
            let response = [];

            await query.get().then(data => {
                let docs = data.docs;
                for (let doc of docs) {
                    const product = {
                        id: doc.id,
                        name: doc.data().name,
                        description: doc.data().description,
                        price: doc.data().price
                    }
                    response.push(product);
                }
                return response;
            });

            return res.status(200).send(response);
        } catch (error) {
            console.log('Error create:', error)
            return res.status(500).send(error);
        }
    })();
});



// Update (Put)
app.put('/api/update/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('products').doc(req.params.id);
            await document.update({
                id: req.body.id,
                name: req.body.name,
                description: req.body.description,
                price: req.body.price
            });
            return res.status(200).send('Update Successful...');
        } catch (error) {
            console.log('Error create:', error)
            return res.status(500).send(error);
        }
    })();
});

// Delete (Delete)
app.delete('/api/delete/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('products').doc(req.params.id);
            await document.delete();
            return res.status(200).send('Delete Successful...');
        } catch (error) {
            console.log('Error create:', error)
            return res.status(500).send(error);
        }
    })();
});



// Export de API to Firebase Cloud Functions
exports.app = functions.https.onRequest(app);