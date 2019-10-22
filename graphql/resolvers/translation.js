import Translation from '../../models/Translation';

const resolvers = {
	Query: {
		translations: async (root, { language }, context) => {
            const translations = await Translation.findAll();
            return translations;
        }
	}
};

module.exports = resolvers;
