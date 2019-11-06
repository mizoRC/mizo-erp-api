import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

export const buildEmployeeRegisterBody = (data) => {
    const employeeRegisterTemplate = fs.readFileSync(path.resolve(__dirname, `../handlebars/template.hbs`), 'utf8');

    const html = Handlebars.compile(employeeRegisterTemplate)(data);
    return html;
}