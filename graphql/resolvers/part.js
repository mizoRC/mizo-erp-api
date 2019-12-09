import { withFilter } from 'apollo-server-express';
import app from '../../server';
import Part from '../../models/Part';
import Customer from '../../models/Customer';
import { Employee } from '../../models/CompanyEmployee';
import { Op } from 'sequelize';
import moment from 'moment';
import { ROLES } from '../../constants';
import { getEmployeeFromJWT } from '../../utils/auth';
import { isValidUUID } from '../../utils/validations';

const resolvers = {
	Query: {
        part: async (root, { partId }, context) => {
            const part = await Part.findOne({
                where: {
                    partId: partId
                },
                include: [
                    {
                        model: Employee,
                        as: 'employee'
                    },
                    {
                        model: Customer,
                        as: 'customer'
                    }
                ]
            });
            return part;
        },
        parts: async (root, { filters, options }, context) => {
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
                            'partId': filter.value
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

                    dateParams = {date: {
                        [Op.lt]: toDate,
                        [Op.gt]: fromDate
                    }}
                }
            });

            let whereAndArray = [
                searchParams,
                {companyId: company.id},
                {active: true} 
            ]

            if(dateParams) whereAndArray.push(dateParams);
            if(employee.role === ROLES.TECHNICIAN) whereAndArray.push({
                employeeId: employee.id
            });

            findParams.where = {
                [Op.and]:whereAndArray
            };

            findParams.order = [
                ['id', 'DESC']
            ];

            if(limit > 0)findParams.limit = limit;
            if(offset > 0) findParams.offset = offset; 

            let includeArray = [];
            if(customerParams){
                includeArray.push({
                    model: Customer,
                    as: 'customer',
                    where: customerParams
                });
            } else{
                includeArray.push({
                    model: Customer,
                    as: 'customer'
                });
            }

            if(employee.role !== ROLES.TECHNICIAN){
                includeArray.push({
                    model: Employee,
                    as: 'employee'
                });
            }

            findParams.include = includeArray;

            const parts = await Part.findAndCountAll(findParams);

            return parts;
        }
	},
	Mutation: {
        addPart: async (root, { part }, context) => {
			try {
                const JWTemployee = await getEmployeeFromJWT(context.req);
                const company = await JWTemployee.getCompany();

                // const jsonType = JSON.parse(part.type);

                const newPart = {
                    ...part,
                    companyId: company.id
                };

                const createdPart = await Part.create(newPart);

                app.settings.pubsub.publish('partAdded', {partAdded: createdPart});
                
                return createdPart;
			} catch (error) {
				throw new Error(error);
			}
		},
        updatePart: async (root, { part }, context) => {
			try {
                const JWTemployee = await getEmployeeFromJWT(context.req);
                const company = await JWTemployee.getCompany();

                const dbPart = await Part.findOne({where:{id: part.id, companyId: company.id}});

                if(dbPart){
                    dbPart.date = part.date;
                    dbPart.address = part.address;
                    dbPart.reason = part.reason;
                    dbPart.type = part.type;
                    dbPart.finished = part.finished;
                    dbPart.notFinishedReason = part.notFinishedReason;
                    dbPart.employeeId = part.employeeId;
                    dbPart.customerId = part.customerId;

                    const updatedPart = await dbPart.save();

                    app.settings.pubsub.publish('partUpdated', {partUpdated: updatedPart});

                    return updatedPart;
                }
                else{
                    throw new Error("This part doesn't belong to your company");
                }
			} catch (error) {
				throw new Error(error);
			}
		}
	},
	Subscription: {
		partAdded: {
			subscribe: withFilter(() => app.settings.pubsub.asyncIterator("partAdded"), (payload, variables) => {
                return true;
                //return payload.participantUpdated.id.toString() === variables.participantId
            })
		},
        partUpdated: {
			subscribe: withFilter(() => app.settings.pubsub.asyncIterator("partUpdated"), (payload, variables) => {
                return true;
                //return payload.participantUpdated.id.toString() === variables.participantId
            })
		}
	}
};

module.exports = resolvers;
