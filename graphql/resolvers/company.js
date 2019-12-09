import { withFilter } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../../server';
import { Company, Employee } from '../../models/CompanyEmployee';
import { getEmployeeFromJWT } from '../../utils/auth';
import { ROLES } from '../../constants';

const resolvers = {
	Query: {
        company: async (root, {  }, context) => {
            const employee = await getEmployeeFromJWT(context.req);
            const company = await employee.getCompany();
            return company
        },
		companies: async (root, {  }, context) => {
            const companies = await Company.findAll();
            return companies;
        }
	},
	Mutation: {
        register: async (root, { registerInfo }, context) => {
			try {
                const hash = await bcrypt.hash(registerInfo.password, 10);

                const existEmail = await Employee.findOne({where: {email: registerInfo.email}});

                if(existEmail){
                    throw new Error('Email already registered');
                }
                else{
                    const newEmployee = {
                        name: registerInfo.name,
                        surname: registerInfo.surname,
                        email: registerInfo.email,
                        password: hash,
                        language: registerInfo.language,
                        role: ROLES.MANAGER
                    };

                    const newCompany = {
                        name: registerInfo.companyName,
                        phone: registerInfo.phone,
                        country: registerInfo.country,
                        address: registerInfo.address,
                        employees: [newEmployee]
                    };

                    const company = await Company.create(newCompany, {
                        include: [{
                            model: Employee,
                            as: 'employees'
                        }]
                    }); 

                    let employeeToTokenize = {
                        ...newEmployee,
                        companyId: company.id,
                        id: company.employees[0].id
                    }

                    const token = jwt.sign({employee:employeeToTokenize}, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 8}); //8H    

                    const registered = {
                        company: company,
                        token: token
                    };

                    return registered;
                }    
			} catch (error) {
				throw new Error(error);
			}
		},
		addCompany: async (root, { company }, context) => {
			try {
                const createdCompany = await Company.create(company);

                return createdCompany;
			} catch (error) {
				throw new Error(error);
			}
		},
        updateCompany: async (root, { updateInfo }, context) => {
			try {
                const employee = await getEmployeeFromJWT(context.req);
                const company = await employee.getCompany();

                company.name = updateInfo.name;
                company.country = updateInfo.country;
                company.address = updateInfo.address;
                company.phone = updateInfo.phone;
                if(!!updateInfo.logo) company.logo = updateInfo.logo;

                await company.save();
                await Employee.findOne({where: {id: employee.id}});

                const plainEmployee = employee.get({ plain: true });
                const {logo, ...plainCompany} = company.get({ plain: true });
                const tokenEmployee = {...plainEmployee, company: plainCompany};

                const token = jwt.sign({employee: tokenEmployee}, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 8}); //16H
                return { token };
			} catch (error) {
				throw new Error(error);
			}
		}
	}
};

module.exports = resolvers;
