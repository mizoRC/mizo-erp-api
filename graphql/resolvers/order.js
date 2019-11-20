import { Order, Line } from '../../models/Order';
import Customer from '../../models/Customer';
import { Op } from 'sequelize';
import { getEmployeeFromJWT } from '../../utils/auth';
import { isValidUUID } from '../../utils/validations';

const resolvers = {
	Query: {
        orders: async (root, { filters, options }, context) => {
            const employee = await getEmployeeFromJWT(context.req);
            const company = await employee.getCompany();

            const limit = (!!options && !!options.limit) ? options.limit : 0;
            const offset = (!!options && !!options.offset) ? options.offset : 0;


            let findParams = { where:{  } };


            let searchParams;
            let customerParams;
            let dateParams;
            filters.forEach(filter => {
                if(filter.field === 'search'){
                    const validUUID = isValidUUID(filter.value);
                    if(validUUID){
                        searchParams = {
                            'ticketId': filter.value
                        }
                    }
                    else{
                        if(filter.value !== ""){
                            customerParams = {
                                name: {[Op.iLike]: `%${filter.value}%`}
                            }
                        }
                    }
                }
                /* else if(filter.field === 'date'){
                    dateParams = {date: {[Op.iLike]: `%${filter.value}%`}}
                } */
            });

           /*  if(categoryParams){
                findParams.where = {
                    [Op.and]:[
                            searchParams,
                            paymentMethodParams,
                            {companyId: company.id},
                            {active: true} 
                    ]
                };
            }
            else{ */
                /* findParams.where = {
                    [Op.and]:[
                            searchParams,
                            {companyId: company.id},
                            {active: true} 
                    ]
                }; */
            //}
            
            findParams.where = {
                [Op.and]:[
                    searchParams,
                    {companyId: company.id},
                    {active: true} 
                ]
            };

            findParams.order = [
                ['id', 'DESC']
            ];

            if(limit > 0)findParams.limit = limit;
            if(offset > 0) findParams.offset = offset; 
            
            //{$eq: null}

            if(customerParams){
                findParams.include = [{
                    model: Customer,
                    as: 'customer',
                    where: customerParams
                }];
            } else{
                findParams.include = [{
                    model: Customer,
                    as: 'customer'
                }];
            }

            const orders = await Order.findAndCountAll(findParams);

            return orders;
        }
	},
	Mutation: {
        addOrder: async (root, { order }, context) => {
			try {
                const JWTemployee = await getEmployeeFromJWT(context.req);
                const company = await JWTemployee.getCompany();

                const newOrder = {
                    ...order,
                    companyId: company.id,
                    employeeId: JWTemployee.id
                };

                const createdOrder = await Order.create(newOrder, {
                    include: [{
                        model: Line,
                        as: 'lines'
                    }]
                });
                return createdOrder;
			} catch (error) {
				throw new Error(error);
			}
		}
	}
};

module.exports = resolvers;
