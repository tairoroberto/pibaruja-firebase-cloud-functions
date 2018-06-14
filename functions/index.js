'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const express = require("express");
const app = require('express')();
const router = express.Router();

admin.initializeApp(functions.config().firebase);

/*##### USER ######*/
app.route("/event")
    .get((req, res) => {
        const lastEdition = admin.database().ref('/events');
        lastEdition
            .once('value')
            .then((snapshot) => {
                return res.status(200).send(snapshot.val());
            })
            .catch((error) => {
                console.log("Erro ao buscar dados:", error);
                return res.status(500).send({"success": true, "message": "Erro ao buscar dados: " + error});
            });
    })
    .post((req, res) => {
        const userRef = admin.database().ref('/events');

        let event = req.body;
        event.date = new Date(Date.now()).toISOString();

        event.uid = userRef.push(event).key;
        userRef.push(event)
            .then(() => {
                return res.status(200).send({"success": true, "message": "Evento salvo com sucesso"});
            })
            .catch((error) => {
                console.log("Erro ao salvar evento:", error);
                return res.status(500).send({"success": true, "message": "Erro ao salvar evento: " + error});
            });

    }).put((req, res) => {
    const lastEdition = admin.database().ref('/events/' + req.body.id);
    lastEdition
        .once('value')
        .then((snapshot) => {
            let user = snapshot.val();

            return res.status(200).send();
        })
        .catch((error) => {
            console.log("Erro ao atualizar dados do usuário:", error);
            return res.status(500).send({"success": true, "message": "Erro ao atualizar dados do usuário: " + error});
        });
});

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/* Send notification toi topic */
app.post("/notification", (req, res) => {
    const topic = "ecpc";

    admin.messaging().sendToTopic(topic, req.body)
        .then((response) => {
            console.log("Mensagem enviada com sucesso:", response);
            return res.send({"success": true, "message": "Mensagem enviada com sucesso"});
        })
        .catch((error) => {
            console.log("Erro ao enviar a mensagem:", error);
            return res.status(500).send({"success": true, "message": "Erro ao enviar a mensagem: " + error});
        });
});

/* Send notification toi topic */
app.route("/email")
    .post((req, res) => {
        const APP_NAME = 'PIB Arujá';
        const gmailEmail = functions.config().gmail.email;
        const gmailPassword = functions.config().gmail.password;
        const mailTransport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmailEmail,
                pass: gmailPassword,
            },
        });

        const mailOptions = {
            from: `${APP_NAME} <fsoare32@gmail.com>`,
            to: req.body.email,
        };

        // The user subscribed to the newsletter.
        mailOptions.subject = `${APP_NAME}: ` + req.body.subject;
        mailOptions.text = `Olá ${req.body.name || ''}! a ${APP_NAME} tem uma mensagem para você.\n` + req.body.message;
        return mailTransport.sendMail(mailOptions).then(() => {
            return res.send({"success": true, "message": "Mensagem enviada com sucesso"});
        }).catch((error) => {
            console.log("Erro ao enviar a mensagem:", error);
            return res.status(500).send({"success": false, "message": "Erro ao enviar email para " + req.body.email});
        });
    });

app.use('/', router);
exports.app = functions.https.onRequest(app);