import Customer from '../../models/Customer';
import { getEmployeeFromJWT } from '../../utils/auth';

const resolvers = {
	Query: {
        customers: async (root, {  }, context) => {
            const employee = await getEmployeeFromJWT(context.req);
            const company = await employee.getCompany();

            const customers = await company.getCustomers({ where: { active: true } });
            return customers;
        }
	},
	Mutation: {
        addCustomer: async (root, { customer }, context) => {
			try {
                const JWTemployee = await getEmployeeFromJWT(context.req);
                const company = await JWTemployee.getCompany();

                const newCustomer = {
                    name: customer.name,
                    phone: customer.phone,
                    email: customer.email,
                    address: customer.address,
                    companyId: company.id
                };

                const createdCustomer = await Customer.create(newCustomer);
                return createdCustomer;
			} catch (error) {
				throw new Error(error);
			}
		},
        updateCustomer: async (root, { customer }, context) => {
			try {
                const JWTemployee = await getEmployeeFromJWT(context.req);
                const company = await JWTemployee.getCompany();

                const dbCustomer = await Customer.findOne({where:{id: customer.id, companyId: company.id}});

                if(dbCustomer){
                    dbCustomer.name = customer.name;
                    dbCustomer.phone = customer.phone;
                    dbCustomer.email = customer.email;
                    dbCustomer.address = customer.address;

                    const updatedCustomer = await dbCustomer.save();
                    return updatedCustomer;
                }
                else{
                    throw new Error("This customer doesn't belong to your company");
                }
			} catch (error) {
				throw new Error(error);
			}
		},
        unsubscribeCustomer: async (root, { customerId }, context) => {
            try {
                const JWTemployee = await getEmployeeFromJWT(context.req);
                const company = await JWTemployee.getCompany();

                const dbCustomer = await Customer.findOne({where:{id: customerId, companyId: company.id}});

                if(dbCustomer){
                    dbCustomer.active = false;

                    const updatedCustomer = await dbCustomer.save();
                    return updatedCustomer;
                }
                else{
                    throw new Error("This customer doesn't belong to your company");
                }
            } catch (error) {
                throw new Error(error);
            }
        }
	}
};

module.exports = resolvers;
