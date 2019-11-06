import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import nodemailer from '../setup/nodemailer';

export const buildEmployeeRegisterBody = (data) => {
    const employeeRegisterTemplate = fs.readFileSync(path.resolve(__dirname, `../handlebars/template.hbs`), 'utf8');

    const html = Handlebars.compile(employeeRegisterTemplate)(data);
    return html;
}

export const send = async(subject, body, to) => {
    try {
        const mailOptions = {
            from: process.env.NODEMAILER_ADDRESS, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            html: body// plain text body
        };
        const info = await nodemailer.sendMail(mailOptions);
        return info;
    } catch (error) {
        throw Error(error);   
    }
}