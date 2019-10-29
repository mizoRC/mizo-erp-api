import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Employee } from '../../models/CompanyEmployee';
import { getEmployeeFromJWT } from '../../utils/auth';

const resolvers = {
	Query: {
		me: async (root, {  }, context) => {
            const employee = await getEmployeeFromJWT(context.req);
            const companies = await employee.getCompanies();
            employee.companies = companies;
            return employee;
        }
	},
	Mutation: {
        login: async (root, { email, password }, context) => {
			try {
                const employee = await Employee.findOne({where: {email: email}});
                const match = await bcrypt.compare(password, employee.password);
                if(match && employee.active == 1){
                    const token = jwt.sign({employee: employee}, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 8}); //16H
                    return { token };
                }
                else{
                    throw new Error('Invalid employee');
                }
			} catch (error) {
				throw new Error(error);
			}
		}
	}
};

module.exports = resolvers;
