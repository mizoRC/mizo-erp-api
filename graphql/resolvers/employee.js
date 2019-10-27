import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Employee from '../../models/Employee';

const resolvers = {
	Query: {
		me: async (root, {  }, context) => {
            return 'TO-DO';
            /* const employee = await getEmployeeFromJWT(context.req);
            if (!employee) {
                throw new AuthError(440, 'Invalid token');
            }

            const result = await Employee.findOne({
                where: {
                    id: employee.id
                }
            });

            Employee.update({
                lastConnectionDate: new Date().toISOString()
            }, {
                    where: {
                        id: employee.id
                    }
                });
            return result; */
        }
	},
	Mutation: {
        login: async (root, { email, password }, context) => {
			try {
                const employee = await Employee.findOne({where: {email: email}});
                const match = await bcrypt.compare(password, employee.password);
                console.log('Employee', employee);
                console.log('MATCH', match);
                if(match && employee.active == 1){
                    const token = jwt.sign({employee: employee}, 'secret', { expiresIn: 60 * 60 * 8}); //16H
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
