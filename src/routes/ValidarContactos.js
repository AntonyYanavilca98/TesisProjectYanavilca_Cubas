const express = require('express');

const nodemailer = require('nodemailer');


const router = express.Router();

router.post('/form-send', (req, res) => {

    const { nombreC, emailC, telefonoC, mensajeC, asuntoC } = req.body;
    contentHTML = `
        <h1>Informacion del Usuario</h1>
        <ul>
        <li>Nombre: ${nombreC}</li>
        <li>correo: ${emailC}</li>
        <li>Telefono: ${telefonoC}</li>
        </ul>
        <h1>Mensaje</h1>
        <p>${mensajeC}</p>
    `;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'antony.yanavilca@tecsup.edu.pe',
            pass: '1inmortalsasuke1'
        }
    });


    let mailOptions = {
        from: emailC,
        to: 'leonid.cubas@tecsup.edu.pe',
        subject: asuntoC,
        html: contentHTML
    }

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) return console.log(err);
        console.log("Email enviado");
    });
    res.redirect('index.html');
});

module.exports = router;