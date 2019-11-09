import Category from '../../models/Category';
import { getEmployeeFromJWT } from '../../utils/auth';

const resolvers = {
	Query: {
        categories: async (root, { }, context) => {
            const employee = await getEmployeeFromJWT(context.req);
            const company = await employee.getCompany();

            const categories = await company.getCategories({where: { active: true }});
            return categories;
        }
	},
	Mutation: {
        addCategory: async (root, { category }, context) => {
			try {
                const JWTemployee = await getEmployeeFromJWT(context.req);
                const company = await JWTemployee.getCompany();

                const newCategory = {
                    name: category.name,
                    companyId: company.id
                };

                const createdCategory = await Category.create(newCategory);
                return createdCategory;
			} catch (error) {
				throw new Error(error);
			}
		}
	}
};

module.exports = resolvers;
