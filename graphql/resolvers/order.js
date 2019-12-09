import { withFilter } from 'apollo-server-express';
import app from '../../server';
import { Order, Line } from '../../models/Order';
import Customer from '../../models/Customer';
import { Op } from 'sequelize';
import moment from 'moment';
import { getEmployeeFromJWT } from '../../utils/auth';
import { isValidUUID } from '../../utils/validations';

const resolvers = {
	Query: {
        order: async (root, { ticketId, customerId }, context) => {
            let customerParams;

            if(customerId){
                customerParams = {
                    model: Customer,
                    as: 'customer',
                    where: {
                        id: customerId
                    }
                };
            } else{
                customerParams = {
                    model: Customer,
                    as: 'customer'
                };
            }

            const order = await Order.findOne({
                where: {
                    ticketId: ticketId
                },
                include: [
                    {
                        model: Line,
                        as: 'lines'
                    },
                    customerParams
                ]
            });
            return order;
        },
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
                else if(filter.field === 'date'){
                    const fromDate = new Date(`${filter.value} 02:00:00`);
                    const toDate = moment(fromDate).add(1, 'days').toDate();

                    dateParams = {creationDate: {
                        [Op.lt]: toDate,
                        [Op.gt]: fromDate
                    }}
                }
            });

           if(dateParams){
                findParams.where = {
                    [Op.and]:[
                            searchParams,
                            dateParams,
                            {companyId: company.id},
                            {active: true} 
                    ]
                };
            }
            else{
                findParams.where = {
                    [Op.and]:[
                            searchParams,
                            {companyId: company.id},
                            {active: true} 
                    ]
                };
            }

            findParams.order = [
                ['id', 'DESC']
            ];

            if(limit > 0)findParams.limit = limit;
            if(offset > 0) findParams.offset = offset; 

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

                let includeParams = [
                    {
                        model: Line,
                        as: 'lines'
                    }
                ];

                if(!!newOrder.customerId){
                    includeParams.push({
                        model: Customer,
                        as: 'customer',
                        where: {id: newOrder.customerId}
                    })
                }

                const createdOrder = await Order.create(newOrder, {
                    include: includeParams
                });

                const customer = await createdOrder.getCustomer();
                let plainCustomer;
                if(customer) plainCustomer = await customer.toJSON();

                let plainOrder = await createdOrder.toJSON();
                plainOrder.customer = plainCustomer;

                app.settings.pubsub.publish('orderAdded', {orderAdded: plainOrder});

                return createdOrder;
			} catch (error) {
				throw new Error(error);
			}
		}
	},
	Subscription: {
		orderAdded: {
			subscribe: withFilter(() => app.settings.pubsub.asyncIterator("orderAdded"), (payload, variables) => {
                return payload.orderAdded.companyId === variables.companyId;
            })
		}
	}
};

module.exports = resolvers;
