'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

admin.initializeApp(functions.config().firebase);

app.post("/event", (req, res) => {
    const lastEdition = admin.database().ref('/events');
    const date = new Date(Date.now()).toISOString();

    lastEdition
        .set({
            date: date,
            event: req.body
        })
        .then(function () {
            res.send({"success": true, "message": "Evento salvo com sucesso"});
        })
        .catch(function (error) {
            console.log("Erro ao salvar evento:", error);
            res.status(500).send('Erro ao salvar evento: ' + error);
        });
});

app.get("/event", (req, res) => {
    const lastEdition = admin.database().ref('/events');
    lastEdition
        .once('value')
        .then(function (snapshot) {
            res.status(200).send(snapshot.val());
        })
        .catch(function (error) {
            console.log("Erro ao buscar dados:", error);
            res.status(500).send('Erro ao buscar dados: ' + error);
        });
});

/* Send notification toi topic */
app.post("/notification", (req, res) => {
    const topic = "ecpc";

    admin.messaging().sendToTopic(topic, req.body)
        .then(function (response) {
            console.log("Mensagem enviada com sucesso:", response);
            res.send({"success": true, "message": "Mensagem enviada com sucesso"});
        })
        .catch(function (error) {
            console.log("Erro ao enviar a mensagem:", error);
            res.status(500).send('Erro ao enviar a mensagem: ' + error);
        });
});


exports.app = functions.https.onRequest(app);