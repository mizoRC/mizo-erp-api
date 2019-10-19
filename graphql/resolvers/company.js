import { withFilter } from 'apollo-server-express';
import app from '../../server';
import Company from '../../models/Company';

const resolvers = {
	Query: {
		companies: async (root, {  }, context) => {
            const companies = await Company.findAll();
            return companies;
        }
	},
	Mutation: {
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
