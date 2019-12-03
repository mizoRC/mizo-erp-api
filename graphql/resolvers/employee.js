import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { buildEmployeeRegisterBody, send } from '../../utils/emails';
import { Employee, Company } from '../../models/CompanyEmployee';
import { getEmployeeFromJWT } from '../../utils/auth';
import { ROLES } from '../../constants';
import logger from '../../utils/logger';

const resolvers = {
	Query: {
		me: async (root, {  }, context) => {
            const employee = await getEmployeeFromJWT(context.req);
            const company = await employee.getCompany();
            employee.company = company;
            
            return employee;
        },
        employees: async (root, {  }, context) => {
            const employee = await getEmployeeFromJWT(context.req);
            const company = await employee.getCompany();

            const employees = await company.getEmployees({ where: { [Op.and]: [ { id: { [Op.not]: employee.id } }, { active: true } ]}});
            return employees;
        },
        technicians: async (root, {  }, context) => {
            const employee = await getEmployeeFromJWT(context.req);
            const company = await employee.getCompany();

            const technicians = await company.getEmployees({ where: { [Op.and]: [ { id: { [Op.not]: employee.id } }, { active: true }, { role: ROLES.TECHNICIAN} ]}});
            return technicians;
        }
	},
	Mutation: {
        login: async (root, { email, password }, context) => {
			try {
                const employee = await Employee.findOne({where: {email: email, active: true}});
                const company = await employee.getCompany();
                const match = await bcrypt.compare(password, employee.password);
                if(match && employee.active == 1){
                    const plainEmployee = employee.get({ plain: true });
                    const {logo, ...plainCompany} = company.get({ plain: true });
                    const tokenEmployee = {...plainEmployee, company: plainCompany};
                    const token = jwt.sign({employee: tokenEmployee}, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 8}); //16H
                    return { token };
                }
                else{
                    throw new Error('Invalid employee');
                }
			} catch (error) {
				throw new Error(error);
			}
		},
        registerEmployee: async (root, { newPassword }, context) => {
			try {
                const employee = await getEmployeeFromJWT(context.req);
                const company = await employee.getCompany();

                if(employee.registered){
                    throw new Error('Employee already registered');
                }
                else{
                    const hash = await bcrypt.hash(newPassword, 10);
                    employee.password = hash;
                    employee.registered = true;
                    
                    const updatedEmployee = await employee.save();

                    const plainEmployee = updatedEmployee.get({ plain: true });
                    const {logo, ...plainCompany} = company.get({ plain: true });
                    const tokenEmployee = {...plainEmployee, company: plainCompany};
                    const token = jwt.sign({employee: tokenEmployee}, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 8}); //16H
                    return { token };
                }
			} catch (error) {
				throw new Error(error);
			}
		},
        updateEmployeeMe: async (root, { updateInfo }, context) => {
			try {
                const employee = await Employee.findOne({where: {email: updateInfo.email}});
                const company = await Company.findOne({where: {id: employee.companyId}});
                const match = await bcrypt.compare(updateInfo.password, employee.password);
                if(match && employee.active == 1){
                    employee.name = updateInfo.name;
                    employee.surname = updateInfo.surname;
                    employee.language = updateInfo.language;
                    if(!!updateInfo.newPassword && (updateInfo.newPassword === updateInfo.newPasswordRepeated)) {
                        const hash = await bcrypt.hash(updateInfo.newPassword, 10);
                        employee.password = hash;
                    }
                    
                    const updatedEmployee = await employee.save();

                    const plainEmployee = updatedEmployee.get({ plain: true });
                    const {logo, ...plainCompany} = company.get({ plain: true });
                    const tokenEmployee = {...plainEmployee, company: plainCompany};
                    const token = jwt.sign({employee: tokenEmployee}, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 8}); //16H
                    return { token };
                }
                else{
                    throw new Error('Password not match');
                }
			} catch (error) {
				throw new Error(error);
			}
		},
        addEmployee: async (root, { employee }, context) => {
			try {
                const JWTemployee = await getEmployeeFromJWT(context.req);
                const company = await JWTemployee.getCompany();

                const hash = await bcrypt.hash("00000000", 10);
                const newEmployee = {
                    name: employee.name,
                    surname: employee.surname,
                    email: employee.email,
                    password: hash,
                    language: employee.language,
                    role: employee.role,
                    companyId: company.id,
                    registered: false
                };

                const createdEmployee = await Employee.create(newEmployee);

                try {
                    const registerToken = jwt.sign({employee:createdEmployee}, process.env.JWT_SECRET);
                    const data = {
                        logo: 'https://api-erp.mizo.es/logo/get',
                        name: createdEmployee.name,
                        company: company.name,
                        employeeRegisterLink: `${process.env.MIZO_ERP_CLOUD_URL}/register/${registerToken}`
                    };
                    const subject = "Bienvenido a MizoERP Cloud"
                    const body = buildEmployeeRegisterBody(data);
                    const to = createdEmployee.email;
                    await send(subject, body, to);
                } catch (error) {
                    logger.error('ERROR SENDING ADD EMPLOYEE EMAIL');
                    logger.error(error);
                }
                finally {
                    return createdEmployee;
                }
			} catch (error) {
				throw new Error(error);
			}
		},
        updateEmployee: async (root, { employee }, context) => {
			try {
                const JWTemployee = await getEmployeeFromJWT(context.req);
                const company = await JWTemployee.getCompany();

                const dbEmployee = await Employee.findOne({where:{id: employee.id, companyId: company.id}});

                if(dbEmployee){
                    dbEmployee.name = employee.name;
                    dbEmployee.surname = employee.surname;
                    dbEmployee.email = employee.email;
                    dbEmployee.language = employee.language;
                    dbEmployee.role = employee.role;

                    const updatedEmployee = await dbEmployee.save();
                    return updatedEmployee;
                }
                else{
                    throw new Error("This employee doesn't belong to your company");
                }
			} catch (error) {
				throw new Error(error);
			}
		},
        unsubscribeEmployee: async (root, { employeeId }, context) => {
            try {
                const JWTemployee = await getEmployeeFromJWT(context.req);
                const company = await JWTemployee.getCompany();

                const dbEmployee = await Employee.findOne({where:{id: employeeId, companyId: company.id}});

                if(dbEmployee){
                    dbEmployee.active = false;

                    const updatedEmployee = await dbEmployee.save();
                    return updatedEmployee;
                }
                else{
                    throw new Error("This employee doesn't belong to your company");
                }
            } catch (error) {
                throw new Error(error);
            }
        }
	}
};

module.exports = resolvers;
