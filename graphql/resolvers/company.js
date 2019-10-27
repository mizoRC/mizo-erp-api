import { withFilter } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../../server';
import Company from '../../models/Company';
import Employee from '../../models/Employee';
import { ROLES } from '../../constants';

const resolvers = {
	Query: {
		companies: async (root, {  }, context) => {
            const companies = await Company.findAll();
            return companies;
        }
	},
	Mutation: {
        register: async (root, { registerInfo }, context) => {
			try {
                console.log(registerInfo);
                const hash = await bcrypt.hash(registerInfo.password, 10);

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
                    companyId: company.id
                }

                const token = jwt.sign({employee:employeeToTokenize}, 'secret', { expiresIn: 60 * 60 * 8}); //8H    

                const registered = {
                    company: company,
                    token: token
                };

                return registered;    
			} catch (error) {
				throw new Error(error);
			}
		},
		addCompany: async (root, { company }, context) => {
			try {
                const createdCompany = await Company.create(company);

                app.settings.pubsub.publish('companyAdded', {companyAdded: createdCompany});

                return createdCompany;
			} catch (error) {
				throw new Error(error);
			}
		}
	},
	Subscription: {
		companyAdded: {
			subscribe: withFilter(() => app.settings.pubsub.asyncIterator("companyAdded"), (payload, variables) => {
                return true;
                //return payload.participantUpdated.id.toString() === variables.participantId
            })
		}
	}
};

module.exports = resolvers;
