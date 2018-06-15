'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const express = require("express");
const app = require('express')();
const router = express.Router();

admin.initializeApp(functions.config().firebase);

/*############### User ###############*/
app.route("/user")
    .get((req, res) => {
        const userRef = admin.database().ref('/users');
        userRef
            .once('value')
            .then((snapshot) => {

                let events = [];
                snapshot.forEach((data) => {
                    let event = data.val();
                    event.uid = data.key;
                    events.push(event)
                });
                return res.status(200).send({"success": true, "users": events});
            })
            .catch((error) => {
                console.log("Erro ao buscar dados:", error);
                return res.status(500).send({"success": false, "message": "Erro ao buscar dados: " + error});
            });
    })
    .post((req, res) => {
        const userRef = admin.database().ref('/users');

        userRef.push({
            name: req.body.name,
            description: req.body.description,
            date: req.body.date,
            image: req.body.image,
            local: req.body.local,
            sponsor: req.body.sponsor,
            created_at: new Date(Date.now()).toISOString()
        }).then(() => {
            return res.status(200).send({"success": true, "message": "Usuário salvo com sucesso"});
        }).catch((error) => {
            console.log("Erro ao salvar usuário:", error);
            return res.status(500).send({"success": false, "message": "Erro ao salvar usuário: " + error});
        });

    }).put((req, res) => {
    const userRef = admin.database().ref('/users/' + req.body.uid);
    userRef
        .once('value')
        .then((snapshot) => {
            let event = {};
            event.name = req.body.name;
            event.description = req.body.description;
            event.date = req.body.date;
            event.image = req.body.image;
            event.local = req.body.local;
            event.sponsor = req.body.sponsor;

            return userRef.set(event)
                .then(() => {
                    return res.status(200).send({"success": true, "message": "Usuário atualizado com sucesso"});
                })
                .catch((error) => {
                    console.log("Erro ao salvar usuário:", error);
                    return res.status(500).send({"success": false, "message": "Erro ao atualizar usuário: " + error});
                });
        })
        .catch((error) => {
            console.log("Erro ao atualizar dados do usuário:", error);
            return res.status(500).send({"success": false, "message": "Erro ao atualizar dados do usuário: " + error});
        });
}).delete((req, res) => {
    const userRef = admin.database().ref('/users/' + req.body.uid);
    userRef
        .remove()
        .then(() => {
            return res.status(200).send({"success": true, "message": "Usuário deletado com sucesso"});
        })
        .catch((error) => {
            console.log("Erro ao deletar dados do usuário:", error);
            return res.status(500).send({"success": false, "message": "Erro ao atualizar dados do usuário: " + error});
        });
});

/*############### Event ###############*/
app.route("/event")
    .get((req, res) => {
        const eventRef = admin.database().ref('/events');
        eventRef
            .once('value')
            .then((snapshot) => {

                let events = [];
                snapshot.forEach((data) => {
                    let event = data.val();
                    event.uid = data.key;
                    events.push(event)
                });
                return res.status(200).send({"success": true, "events": events});
            })
            .catch((error) => {
                console.log("Erro ao buscar dados:", error);
                return res.status(500).send({"success": false, "message": "Erro ao buscar dados: " + error});
            });
    })
    .post((req, res) => {
        const eventRef = admin.database().ref('/events');

        eventRef.push({
            name: req.body.name,
            description: req.body.description,
            date: req.body.date,
            image: req.body.image,
            local: req.body.local,
            sponsor: req.body.sponsor,
            created_at: new Date(Date.now()).toISOString()
        }).then(() => {
            return res.status(200).send({"success": true, "message": "Evento salvo com sucesso"});
        }).catch((error) => {
            console.log("Erro ao salvar evento:", error);
            return res.status(500).send({"success": false, "message": "Erro ao salvar evento: " + error});
        });

    }).put((req, res) => {
    const eventRef = admin.database().ref('/events/' + req.body.uid);
    eventRef
        .once('value')
        .then((snapshot) => {
            let event = {};
            event.name = req.body.name;
            event.description = req.body.description;
            event.date = req.body.date;
            event.image = req.body.image;
            event.local = req.body.local;
            event.sponsor = req.body.sponsor;

            return eventRef.set(event)
                .then(() => {
                    return res.status(200).send({"success": true, "message": "Evento atualizado com sucesso"});
                })
                .catch((error) => {
                    console.log("Erro ao salvar evento:", error);
                    return res.status(500).send({"success": false, "message": "Erro ao atualizar evento: " + error});
                });
        })
        .catch((error) => {
            console.log("Erro ao atualizar dados do usuário:", error);
            return res.status(500).send({"success": false, "message": "Erro ao atualizar dados do usuário: " + error});
        });
}).delete((req, res) => {
    const eventRef = admin.database().ref('/events/' + req.body.uid);
    eventRef
        .remove()
        .then(() => {
            return res.status(200).send({"success": true, "message": "Evento deletado com sucesso"});
        })
        .catch((error) => {
            console.log("Erro ao deletar dados do usuário:", error);
            return res.status(500).send({"success": false, "message": "Erro ao atualizar dados do usuário: " + error});
        });
});

/*############### Send notification toi topic ###############*/
app.post("/notification", (req, res) => {
    const topic = "ecpc";

    admin.messaging().sendToTopic(topic, req.body)
        .then((response) => {
            console.log("Mensagem enviada com sucesso:", response);
            return res.send({"success": true, "message": "Mensagem enviada com sucesso"});
        })
        .catch((error) => {
            console.log("Erro ao enviar a mensagem:", error);
            return res.status(500).send({"success": false, "message": "Erro ao enviar a mensagem: " + error});
        });
});

/*############### Send email to user ###############*/
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