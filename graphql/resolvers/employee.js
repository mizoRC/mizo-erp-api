import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from '../../setup/nodemailer';
import { Employee } from '../../models/CompanyEmployee';
import { getEmployeeFromJWT } from '../../utils/auth';

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

            const employees = await company.getEmployees({ where: { active: true } });
            return employees;
        }
	},
	Mutation: {
        login: async (root, { email, password }, context) => {
			try {
                const employee = await Employee.findOne({where: {email: email, active: true}});
                const match = await bcrypt.compare(password, employee.password);
                if(match && employee.active == 1){
                    const token = jwt.sign({employee}, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 8}); //16H
                    return { token };
                }
                else{
                    throw new Error('Invalid employee');
                }
			} catch (error) {
				throw new Error(error);
			}
		},
        updateEmployeeMe: async (root, { updateInfo }, context) => {
			try {
                const employee = await Employee.findOne({where: {email: updateInfo.email}});
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

                    const token = jwt.sign({employee: updatedEmployee}, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 8}); //16H
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
                    companyId: company.id
                };

                const createdEmployee = await Employee.create(newEmployee);

                return createdEmployee;
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
