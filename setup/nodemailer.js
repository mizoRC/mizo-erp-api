require('dotenv').config();
import nodemailer from 'nodemailer';
import { buildEmployeeRegisterBody } from '../utils/emails';

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_ADDRESS,
        pass: process.env.NODEMAILER_PASSWORD
    }
});

const send = async() => {
    try {
        const data = {
            logo: 'https://api-erp.mizo.es/logo/get',
            name: "Miguel",
            company: "MizoTech SL",
            employeeRegisterLink: `erp.mizo.es`
        }

        const body = buildEmployeeRegisterBody(data);

        const mailOptions = {
            from: process.env.NODEMAILER_ADDRESS, // sender address
            to: 'mirodriguez11@gmail.com', // list of receivers
            subject: 'El administrador de la compañía ha creado una cuenta para ti.', // Subject line
            html: body// plain text body
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('INFO', info);
    } catch (error) {
        console.error(error);
    }
}


module.exports = transporter;