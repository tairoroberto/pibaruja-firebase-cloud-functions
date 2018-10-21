'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const express = require("express");
const request = require('request');
const requestPromise = require('request-promise');
const app = require('express')();
const router = express.Router();

admin.initializeApp(functions.config().firebase);

/*############### User ###############*/
app.route("/user")
    .get((req, res) => {
        res.header('Content-Type', 'application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

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
        res.header('Content-Type', 'application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        const userRef = admin.database().ref('/users');

        userRef.push({
            email: (req.body.email !== null && req.body.email !== undefined) ? req.body.email : "",
            password: (req.body.password !== null && req.body.password !== undefined) ? req.body.password : "",
            name: (req.body.name !== null && req.body.name !== undefined) ? req.body.name : "",
            birthday: (req.body.birthday !== null && req.body.birthday !== undefined) ? req.body.birthday : "",
            image: (req.body.image !== null && req.body.image !== undefined) ? req.body.image : "",
            address: (req.body.address !== null && req.body.address !== undefined) ? req.body.address : "",
            city: (req.body.city !== null && req.body.city !== undefined) ? req.body.city : "",
            cep: (req.body.cep !== null && req.body.cep !== undefined) ? req.body.cep : "",
            created_at: new Date(Date.now()).toISOString()
        }).then(() => {
            return res.status(200).send({"success": true, "message": "Usuário salvo com sucesso"});
        }).catch((error) => {
            console.log("Erro ao salvar usuário:", error);
            return res.status(500).send({"success": false, "message": "Erro ao salvar usuário: " + error});
        });

    }).put((req, res) => {
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    const userRef = admin.database().ref('/users/' + req.body.uid);
    userRef
        .once('value')
        .then((snapshot) => {
            let user = {};
            user.email = (req.body.email !== null && req.body.email !== undefined) ? req.body.email : "";
            user.password = (req.body.password !== null && req.body.password !== undefined) ? req.body.password : "";
            user.name = (req.body.name !== null && req.body.name !== undefined) ? req.body.name : "";
            user.birthday = (req.body.birthday !== null && req.body.birthday !== undefined) ? req.body.birthday : "";
            user.image = (req.body.image !== null && req.body.image !== undefined) ? req.body.image : "";
            user.address = (req.body.address !== null && req.body.address !== undefined) ? req.body.address : "";
            user.city = (req.body.city !== null && req.body.city !== undefined) ? req.body.city : "";
            user.cep = (req.body.cep !== null && req.body.cep !== undefined) ? req.body.cep : "";

            return userRef.set(user)
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
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

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
        res.header('Content-Type', 'application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

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
        res.header('Content-Type', 'application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        const eventRef = admin.database().ref('/events');

        eventRef.push({
            name: (req.body.name !== null && req.body.name !== undefined) ? req.body.name : "",
            description: (req.body.description !== null && req.body.description !== undefined) ? req.body.description : "",
            date: (req.body.date !== null && req.body.date !== undefined) ? req.body.date : "",
            image: (req.body.image !== null && req.body.image !== undefined) ? req.body.image : "",
            local: (req.body.local !== null && req.body.local !== undefined) ? req.body.local : "",
            sponsor: (req.body.sponsor !== null && req.body.sponsor !== undefined) ? req.body.sponsor : "",
            contact: (req.body.contact !== null && req.body.contact !== undefined) ? req.body.contact : "",
            created_at: new Date(Date.now()).toISOString()
        }).then(() => {
            return res.status(200).send({"success": true, "message": "Evento salvo com sucesso"});
        }).catch((error) => {
            console.log("Erro ao salvar evento:", error);
            return res.status(500).send({"success": false, "message": "Erro ao salvar evento: " + error});
        });

    }).put((req, res) => {
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    const eventRef = admin.database().ref('/events/' + req.body.uid);
    eventRef
        .once('value')
        .then((snapshot) => {
            let event = {};
            event.name = (req.body.name !== null && req.body.name !== undefined) ? req.body.name : "";
            event.description = (req.body.description !== null && req.body.description !== undefined) ? req.body.description : "";
            event.date = (req.body.date !== null && req.body.date !== undefined) ? req.body.date : "";
            event.image = (req.body.image !== null && req.body.image !== undefined) ? req.body.image : "";
            event.local = (req.body.local !== null && req.body.local !== undefined) ? req.body.local : "";
            event.sponsor = (req.body.sponsor !== null && req.body.sponsor !== undefined) ? req.body.sponsor : "";
            event.contact = (req.body.contact !== null && req.body.contact !== undefined) ? req.body.contact : "";

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
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

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

/*############### ECPC DATE ###############*/
app.route("/ecpc/date")
    .get((req, res) => {
        res.header('Content-Type', 'application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        const dateRef = admin.database().ref('/ecpc/');
        dateRef
            .once('value')
            .then((snapshot) => {

                let ecpc_dates = [];
                snapshot.forEach((data) => {
                    let date = {};
                    date.uid = data.key;
                    date.ecpc_date = data.val().ecpc_date;
                    ecpc_dates.push(date)
                });
                return res.status(200).send({"success": true, "ecpc_dates": ecpc_dates});
            })
            .catch((error) => {
                console.log("Erro ao buscar dados:", error);
                return res.status(500).send({"success": false, "message": "Erro ao buscar dados: " + error});
            });
    })
    .post((req, res) => {
        res.header('Content-Type', 'application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        const dateRef = admin.database().ref('/ecpc/');

        if (req.body.ecpc_date !== null && req.body.ecpc_date !== undefined) {
            dateRef.push({ecpc_date: (req.body.ecpc_date !== "") ? req.body.ecpc_date : ""}).then(() => {
                return res.status(200).send({"success": true, "message": "Data do ECPC salvo com sucesso"});
            }).catch((error) => {
                console.log("Erro ao salvar data do ECPC:", error);
                return res.status(500).send({"success": false, "message": "Erro ao salvar data do ECPC: " + error});
            });
        } else {
            return res.status(500).send({
                "success": false,
                "message": "Erro ao salvar data do ECPC data não pode ser vazia"
            });
        }

    }).put((req, res) => {
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    const dateRef = admin.database().ref('/ecpc/' + req.body.uid);
    dateRef
        .once('value')
        .then((snapshot) => {
            let ecpc = {};
            ecpc.ecpc_date = (req.body.ecpc_date !== null && req.body.ecpc_date !== undefined) ? req.body.ecpc_date : "";

            return dateRef.set(ecpc)
                .then(() => {
                    return res.status(200).send({"success": true, "message": "Data do ECPC atualizado com sucesso"});
                })
                .catch((error) => {
                    console.log("Erro ao salvar data do ECPC:", error);
                    return res.status(500).send({
                        "success": false,
                        "message": "Erro ao atualizar data do ECPC : " + error
                    });
                });
        })
        .catch((error) => {
            console.log("Erro ao atualizar dados do data do ECPC :", error);
            return res.status(500).send({
                "success": false,
                "message": "Erro ao atualizar dados do data do ECPC: " + error
            });
        });
}).delete((req, res) => {
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    const dateRef = admin.database().ref('/ecpc/' + req.body.uid);
    dateRef
        .remove()
        .then(() => {
            return res.status(200).send({"success": true, "message": "Data do ECPC deletado com sucesso"});
        })
        .catch((error) => {
            console.log("Erro ao deletar dados do data do ECPC:", error);
            return res.status(500).send({
                "success": false,
                "message": "Erro ao atualizar dados do data do ECPC: " + error
            });
        });
});


/*############### ECPC MARRIES COUPLE ###############*/
app.route("/ecpc/married_couple")
    .get((req, res) => {
        res.header('Content-Type', 'application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        const eventRef = admin.database().ref('/ecpc/' + req.query.ecpc_date_uid + "/married_couple");
        eventRef
            .once('value')
            .then((snapshot) => {

                let ecpc = [];
                snapshot.forEach((data) => {
                    let event = data.val();
                    event.uid = data.key;
                    ecpc.push(event)
                });
                return res.status(200).send({"success": true, "ecpc": ecpc});
            })
            .catch((error) => {
                console.log("Erro ao buscar dados:", error);
                return res.status(500).send({"success": false, "message": "Erro ao buscar dados: " + error});
            });
    })
    .post((req, res) => {

        res.header('Content-Type', 'application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        if (req.body.ecpc_date_uid != null && req.body.ecpc_date_uid !== undefined) {
            return setMarriedCouple(req, res, req.body.ecpc_date_uid);
        } else {

            let options = {
                uri: 'https://us-central1-pibaruja-39957.cloudfunctions.net/app/ecpc/date',
                headers: {
                    'User-Agent': 'Request-Promise',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                json: true
            };

            return requestPromise(options)
                .then(function (data) {
                    if (data.ecpc_dates[0].ecpc_date != null && data.ecpc_dates[0].ecpc_date !== undefined) {
                        return setMarriedCouple(req, res, data.ecpc_dates[0].uid);
                    }
                    return res.status(200).send({"success": true, "message": "Casal do ECPC salvo com sucesso"});
                })
                .catch(function (error) {
                    return res.status(500).send({
                        "success": false,
                        "message": "Erro ao salvar casal do ECPC: " + error
                    });
                });
        }

    }).put((req, res) => {
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    const eventRef = admin.database().ref('/ecpc/' + req.body.ecpc_date_uid + "/married_couple" + "/" + req.body.uid);
    eventRef
        .once('value')
        .then((snapshot) => {
            let ecpc = {};
            ecpc.ecpc_date_uid = (req.body.ecpc_date_uid !== null && req.body.ecpc_date_uid !== undefined) ? req.body.ecpc_date_uid : "";
            ecpc.ecpc_date = (req.body.ecpc_date !== null && req.body.ecpc_date !== undefined) ? req.body.ecpc_date : "";
            ecpc.husband_name = (req.body.husband_name !== null && req.body.husband_name !== undefined) ? req.body.husband_name : "";
            ecpc.husband_nickname = (req.body.husband_nickname !== null && req.body.husband_nickname !== undefined) ? req.body.husband_nickname : "";
            ecpc.husband_birthday = (req.body.husband_birthday !== null && req.body.husband_birthday !== undefined) ? formatDate(req.body.husband_birthday) : "";
            ecpc.husband_church = (req.body.husband_church !== null && req.body.husband_church !== undefined) ? req.body.husband_church : "";
            ecpc.husband_father = (req.body.husband_father !== null && req.body.husband_father !== undefined) ? req.body.husband_father : "";
            ecpc.husband_mother = (req.body.husband_mother !== null && req.body.husband_mother !== undefined) ? req.body.husband_mother : "";
            ecpc.husband_email = (req.body.husband_email !== null && req.body.husband_email !== undefined) ? req.body.husband_email : "";
            ecpc.husband_cellphone = (req.body.husband_cellphone !== null && req.body.husband_cellphone !== undefined) ? req.body.husband_cellphone : "";
            ecpc.husband_observations = (req.body.husband_observations !== null && req.body.husband_observations !== undefined) ? req.body.husband_observations : "";

            ecpc.wife_name = (req.body.wife_name !== null && req.body.wife_name !== undefined) ? req.body.wife_name : "";
            ecpc.wife_nickname = (req.body.wife_nickname !== null && req.body.wife_nickname !== undefined) ? req.body.wife_nickname : "";
            ecpc.wife_birthday = (req.body.wife_birthday !== null && req.body.wife_birthday !== undefined) ? formatDate(req.body.wife_birthday) : "";
            ecpc.wife_church = (req.body.wife_church !== null && req.body.wife_church !== undefined) ? req.body.wife_church : "";
            ecpc.wife_father = (req.body.wife_father !== null && req.body.wife_father !== undefined) ? req.body.wife_father : "";
            ecpc.wife_mother = (req.body.wife_mother !== null && req.body.wife_mother !== undefined) ? req.body.wife_mother : "";
            ecpc.wife_email = (req.body.wife_email !== null && req.body.wife_email !== undefined) ? req.body.wife_email : "";
            ecpc.wife_cellphone = (req.body.wife_cellphone !== null && req.body.wife_cellphone !== undefined) ? req.body.wife_cellphone : "";
            ecpc.wife_observations = (req.body.wife_observations !== null && req.body.wife_observations !== undefined) ? req.body.wife_observations : "";

            ecpc.kids = (req.body.kids !== null && req.body.kids !== undefined) ? req.body.kids : "";
            ecpc.marriage_date = (req.body.marriage_date !== null && req.body.marriage_date !== undefined) ? formatDate(req.body.marriage_date) : "";
            ecpc.fixed_phone = (req.body.fixed_phone !== null && req.body.fixed_phone !== undefined) ? req.body.fixed_phone : "";

            ecpc.address = (req.body.address !== null && req.body.address !== undefined) ? req.body.address : "";
            ecpc.address_number = (req.body.address_number !== null && req.body.address_number !== undefined) ? req.body.address_number : "";
            ecpc.cep = (req.body.cep !== null && req.body.cep !== undefined) ? req.body.cep : "";
            ecpc.district = (req.body.district !== null && req.body.district !== undefined) ? req.body.district : "";
            ecpc.city = (req.body.city !== null && req.body.city !== undefined) ? req.body.city : "";
            ecpc.state = (req.body.state !== null && req.body.state !== undefined) ? req.body.state : "";
            ecpc.complement = (req.body.complement !== null && req.body.complement !== undefined) ? req.body.complement : "";

            ecpc.sponsor_name = (req.body.sponsor_name !== null && req.body.sponsor_name !== undefined) ? req.body.sponsor_name : "";
            ecpc.sponsor_telephone = (req.body.sponsor_telephone !== null && req.body.sponsor_telephone !== undefined) ? req.body.sponsor_telephone : "";
            ecpc.sponsor_email = (req.body.sponsor_email !== null && req.body.sponsor_email !== undefined) ? req.body.sponsor_email : "";

            return eventRef.set(ecpc)
                .then(() => {
                    return res.status(200).send({"success": true, "message": "Casal do ECPC atualizado com sucesso"});
                })
                .catch((error) => {
                    console.log("Erro ao salvar casal do ECPC:", error);
                    return res.status(500).send({
                        "success": false,
                        "message": "Erro ao atualizar casal do ECPC : " + error
                    });
                });
        })
        .catch((error) => {
            console.log("Erro ao atualizar dados do casal do ECPC :", error);
            return res.status(500).send({
                "success": false,
                "message": "Erro ao atualizar dados do casal do ECPC: " + error
            });
        });
}).delete((req, res) => {
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    const eventRef = admin.database().ref('/ecpc/' + req.body.ecpc_date_uid + "/married_couple" + "/" + req.body.uid);
    eventRef
        .remove()
        .then(() => {
            return res.status(200).send({"success": true, "message": "Casal do ECPC deletado com sucesso"});
        })
        .catch((error) => {
            console.log("Erro ao deletar dados do casal do ECPC:", error);
            return res.status(500).send({
                "success": false,
                "message": "Erro ao atualizar dados do casal do ECPC: " + error
            });
        });
});

function setMarriedCouple(req, res, uid) {
    const ecpcRef = admin.database().ref('/ecpc/' + uid + "/married_couple");

    ecpcRef.push({
        ecpc_date_uid: (uid != null && uid !== undefined) ? uid : "",
        ecpc_date: (req.body.ecpc_date != null && req.body.ecpc_date !== undefined) ? req.body.ecpc_date : "",
        husband_name: (req.body.husband_name != null && req.body.husband_name !== undefined) ? req.body.husband_name : "",
        husband_nickname: (req.body.husband_nickname != null && req.body.husband_nickname !== undefined) ? req.body.husband_nickname : "",
        husband_birthday: (req.body.husband_birthday != null && req.body.husband_birthday !== undefined) ? formatDate(req.body.husband_birthday) : "",
        husband_church: (req.body.husband_church != null && req.body.husband_church !== undefined) ? req.body.husband_church : "",
        husband_father: (req.body.husband_father != null && req.body.husband_father !== undefined) ? req.body.husband_father : "",
        husband_mother: (req.body.husband_mother != null && req.body.husband_mother !== undefined) ? req.body.husband_mother : "",
        husband_email: (req.body.husband_email != null && req.body.husband_email !== undefined) ? req.body.husband_email : "",
        husband_cellphone: (req.body.husband_cellphone != null && req.body.husband_cellphone !== undefined) ? req.body.husband_cellphone : "",
        husband_observations: (req.body.husband_observations != null && req.body.husband_observations !== undefined) ? req.body.husband_observations : "",

        wife_name: (req.body.wife_name != null && req.body.wife_name !== undefined) ? req.body.wife_name : "",
        wife_nickname: (req.body.wife_nickname != null && req.body.wife_nickname !== undefined) ? req.body.wife_nickname : "",
        wife_birthday: (req.body.wife_birthday != null && req.body.wife_birthday !== undefined) ? formatDate(req.body.wife_birthday) : "",
        wife_church: (req.body.wife_church != null && req.body.wife_church !== undefined) ? req.body.wife_church : "",
        wife_father: (req.body.wife_father != null && req.body.wife_father !== undefined) ? req.body.wife_father : "",
        wife_mother: (req.body.wife_mother != null && req.body.wife_mother !== undefined) ? req.body.wife_mother : "",
        wife_email: (req.body.wife_email != null && req.body.wife_email !== undefined) ? req.body.wife_email : "",
        wife_cellphone: (req.body.wife_cellphone != null && req.body.wife_cellphone !== undefined) ? req.body.wife_cellphone : "",
        wife_observations: (req.body.wife_observations != null && req.body.wife_observations !== undefined) ? req.body.wife_observations : "",

        kids: (req.body.kids != null && req.body.kids !== undefined) ? req.body.kids : "",
        marriage_date: (req.body.marriage_date != null && req.body.marriage_date !== undefined) ? formatDate(req.body.marriage_date) : "",
        fixed_phone: (req.body.fixed_phone != null && req.body.fixed_phone !== undefined) ? req.body.fixed_phone : "",

        address: (req.body.address != null && req.body.address !== undefined) ? req.body.address : "",
        address_number: (req.body.address_number != null && req.body.address_number !== undefined) ? req.body.address_number : "",
        cep: (req.body.cep != null && req.body.cep !== undefined) ? req.body.cep : "",
        district: (req.body.district != null && req.body.district !== undefined) ? req.body.district : "",
        city: (req.body.city != null && req.body.city !== undefined) ? req.body.city : "",
        state: (req.body.state != null && req.body.state !== undefined) ? req.body.state : "",
        complement: (req.body.complement != null && req.body.complement !== undefined) ? req.body.complement : "",

        sponsor_name: (req.body.sponsor_name != null && req.body.sponsor_name !== undefined) ? req.body.sponsor_name : "",
        sponsor_telephone: (req.body.sponsor_telephone != null && req.body.sponsor_telephone !== undefined) ? req.body.sponsor_telephone : "",
        sponsor_email: (req.body.sponsor_email != null && req.body.sponsor_email !== undefined) ? req.body.sponsor_email : "",

        created_at: new Date(Date.now()).toISOString()
    }).then(() => {
        let ecpc = req.body;

        let message = "<!DOCTYPE html>\n" +
            "<html lang=\"en\">\n" +
            "<head>\n" +
            "    <meta charset=\"utf-8\">\n" +
            "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n" +
            "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n" +
            "    <meta name=\"description\" content=\"Page Description\">\n" +
            "    <meta name=\"author\" content=\"tairo\">\n" +
            "    <title>Page Title</title>\n" +
            "\n" +
            "    <!-- Bootstrap -->\n" +
            "    <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css\"\n" +
            "          integrity=\"sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm\" crossorigin=\"anonymous\">\n" +
            "</head>\n" +
            "<body>\n" +
            "<br><br>\n" +
            "<div class=\"alert alert-info\" align=\"center\">\n" +
            "    <strong>NOVO ENCONTRISTA</strong>\n" +
            "</div>\n" +
            "<div class=\"alert alert-info\" align=\"center\">\n" +
            "    Data do encontro:&nbsp;<strong>" + ecpc.ecpc_date + "</strong>\n" +
            "</div>\n" +
            "<div class=\"alert alert-info\">\n" +
            "    <div class=\"row\">\n" +
            "        <!-- MARIDO -->\n" +
            "        <div class=\"col-xs-6 col-sm-12 col-md-12 col-lg-6\">\n" +
            "            <ul class=\"list-group\">\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Nome Marido:&nbsp;<strong> " + ecpc.husband_name + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Apelido Marido:&nbsp;<strong> " + ecpc.husband_nickname + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Data de Nascimento Marido:&nbsp;<strong> " + ecpc.husband_birthday + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Denominação (Igreja) Marido:&nbsp;<strong> " + ecpc.husband_church + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Email Marido:&nbsp;<strong> " + ecpc.husband_email + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Celular Marido:&nbsp;<strong> " + ecpc.husband_cellphone + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Nome do Pai Marido:&nbsp;<strong> " + ecpc.husband_father + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Nome da Mãe Marido:&nbsp;<strong> " + ecpc.husband_mother + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Observações A respeito do Marido:&nbsp;<strong> " + ecpc.husband_observations + "</strong>\n" +
            "                </li>\n" +
            "            </ul>\n" +
            "        </div>\n" +
            "\n" +
            "        <!-- ESPOSA -->\n" +
            "        <div class=\"col-xs-6 col-sm-12 col-md-12 col-lg-6\">\n" +
            "            <ul class=\"list-group\">\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Nome Esposa:&nbsp;<strong> " + ecpc.wife_name + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Apelido Esposa:&nbsp;<strong> " + ecpc.wife_nickname + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Data de Nascimento Esposa:&nbsp;<strong> " + ecpc.wife_birthday + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Denominação (Igreja) Esposa:&nbsp;<strong> " + ecpc.wife_church + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Email Esposa:&nbsp;<strong> " + ecpc.wife_email + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Celular Esposa:&nbsp;<strong> " + ecpc.wife_cellphone + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Nome do Pai Esposa:&nbsp;<strong> " + ecpc.wife_father + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Nome da Mãe Esposa:&nbsp;<strong> " + ecpc.wife_mother + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Observações A respeito da Esposa:&nbsp;<strong> " + ecpc.wife_observations + "</strong>\n" +
            "                </li>\n" +
            "            </ul>\n" +
            "        </div>\n" +
            "\n" +
            "        <div class=\"row\">\n" +
            "            <div class=\"alert\">\n" +
            "            </div>\n" +
            "        </div>\n" +
            "\n" +
            "        <!-- RESPONSAVEIS  -->\n" +
            "        <div class=\"col-xs-12 col-sm-1 col-md-12 col-lg-12\">\n" +
            "            <ul class=\"list-group\">\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Quantos Filhos?:&nbsp;<strong>" + ecpc.kids + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Data do Casamento:&nbsp;<strong>" + ecpc.marriage_date + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Telefone Fixo:&nbsp;<strong>" + ecpc.fixed_phone + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    CEP:&nbsp;<strong>" + ecpc.cep + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Endereço:&nbsp;<strong>" + ecpc.address + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Número:&nbsp;<strong>" + ecpc.address_number + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Bairro:&nbsp;<strong>" + ecpc.district + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Cidade:&nbsp;<strong>" + ecpc.city + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Estado:&nbsp;<strong>" + ecpc.state + "</strong>\n" +
            "                </li>\n" +
            "            </ul>\n" +
            "        </div>\n" +
            "\n" +
            "        <div class=\"row\">\n" +
            "            <div class=\"alert\">\n" +
            "            </div>\n" +
            "        </div>\n" +
            "\n" +
            "        <div class=\"col-xs-12 col-sm-1 col-md-12 col-lg-12\">\n" +
            "            <ul class=\"list-group\">\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Casal Responsável\n" +
            "                    (Equipe do Encontro):&nbsp;<strong>" + ecpc.sponsor_name + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Telefone Casal Responsável\n" +
            "                    (Equipe do Encontro):&nbsp;<strong>" + ecpc.sponsor_telephone + "</strong>\n" +
            "                </li>\n" +
            "                <li class=\"list-group-item d-flex  align-items-center\">\n" +
            "                    Email Casal Responsável\n" +
            "                    (Equipe do Encontro):&nbsp;<strong>" + ecpc.sponsor_email + "</strong>\n" +
            "                </li>\n" +
            "            </ul>\n" +
            "        </div>\n" +
            "\n" +
            "        <div class=\"row\">\n" +
            "            <div class=\"alert\">\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</div>\n" +
            "\n" +
            "</body>\n" +
            "</html>";

        let options = {
            method: 'POST',
            uri: 'https://us-central1-pibaruja-39957.cloudfunctions.net/app/email',
            body: {
                email: 'mcpibaruja@gmail.com,tairoroberto@hotmail.com',
                name: '',
                subject: "Novo encontrista cadastrado",
                message: message
            },
            json: true
        };

        return requestPromise(options)
            .then(function (parsedBody) {
                return res.status(200).send({"success": true, "message": "Casal do ECPC salvo com sucesso"});
            })
            .catch(function (err) {
                return res.status(200).send({"success": true, "message": "Casal do ECPC salvo com sucesso"});
            });

    }).catch((error) => {
        return res.status(500).send({"success": false, "message": "Erro ao salvar casal do ECPC: " + error});
    });
}

/*############### Send notification toi topic ###############*/
app.post("/notification", (req, res) => {
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

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
        res.header('Content-Type', 'application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        const APP_NAME = 'PIB Arujá';
        const gmailEmail = functions.config().gmail.email;
        const gmailPassword = functions.config().gmail.password;
        const mailTransport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ecpcpibaruja@gmail.com',
                pass: 'ecpc@2018',
            },
        });

        const mailOptions = {
            from: `${APP_NAME} <mcpibaruja@gmail.com>`,
            to: req.body.email,
        };

        // The user subscribed to the newsletter.
        mailOptions.subject = `${APP_NAME}: ` + req.body.subject;
        mailOptions.html = `Olá ${req.body.name || ''}! a ${APP_NAME} tem uma mensagem para você.\n` + req.body.message;
        return mailTransport.sendMail(mailOptions).then(() => {
            return res.send({"success": true, "message": "Mensagem enviada com sucesso"});
        }).catch((error) => {
            console.log("Erro ao enviar a mensagem:", error);
            return res.status(500).send({"success": false, "message": "Erro ao enviar email para " + req.body.email});
        });
    });

function formatDate(dateString) {
    let date = new Date(dateString);
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
}

app.use('/', router);
exports.app = functions.https.onRequest(app);