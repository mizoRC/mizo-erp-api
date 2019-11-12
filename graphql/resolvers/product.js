import Product from '../../models/Product';
import Category from '../../models/Category';
import { Op } from 'sequelize';
import { getEmployeeFromJWT } from '../../utils/auth';

const resolvers = {
	Query: {
        products: async (root, { filters, options }, context) => {
            const employee = await getEmployeeFromJWT(context.req);
            const company = await employee.getCompany();

            /* const limit = (!!options && !!options.limit) ? options.limit : 0;
            const offset = (!!options && !!options.offset) ? options.offset : 0;


            let findParams = { where:{  } };

            filters.forEach(filter => {
                if(filter.field === 'state'){
                    findParams.where[filter.field] = filter.text;
                }
                else if(filter.field === 'receiver'){
                    findParams.where[filter.field] = {[Op.iLike]: `%${filter.text}%`};
                }
                else{
                    findParams.where.params[filter.field] = filter.text;
                }
            });

            if(limit > 0)findParams.limit = limit;
            if(offset > 0) findParams.offset = offset; 


            const products = await Product.findAndCountAll({ 
                where: {
                    [Op.and]:[
                        {companyId: company.id},
                        {active: true} 
                    ] 
                }
            }); */

            const products = await Product.findAll({ 
                where: {
                    [Op.and]:[
                        {companyId: company.id},
                        {active: true} 
                    ] 
                },
                order: [
                    ['id', 'ASC']
                ]
            });

            return products;
        }
	},
	Mutation: {
        addProduct: async (root, { product }, context) => {
			try {
                const JWTemployee = await getEmployeeFromJWT(context.req);
                const company = await JWTemployee.getCompany();

                const newProduct = {
                    ...product,
                    companyId: company.id
                };

                const createdProduct = await Product.create(newProduct);
                return createdProduct;
			} catch (error) {
				throw new Error(error);
			}
		},
        updateProduct: async (root, { product }, context) => {
			try {
                const JWTemployee = await getEmployeeFromJWT(context.req);
                const company = await JWTemployee.getCompany();

                const dbProduct = await Product.findOne({where:{id: product.id, companyId: company.id}});

                if(dbProduct){
                    dbProduct.name = product.name;
                    dbProduct.brand = product.brand;
                    dbProduct.barcode = product.barcode;
                    dbProduct.price = product.price;
                    dbProduct.image = product.image;
                    dbProduct.vat = product.vat;
                    dbProduct.categoryId = product.categoryId;

                    const updatedProduct = await dbProduct.save();
                    return updatedProduct;
                }
                else{
                    throw new Error("This product doesn't belong to your company");
                }
			} catch (error) {
				throw new Error(error);
			}
		},
        unsubscribeProduct: async (root, { productId }, context) => {
            try {
                const JWTemployee = await getEmployeeFromJWT(context.req);
                const company = await JWTemployee.getCompany();

                const dbProduct = await Product.findOne({where:{id: productId, companyId: company.id}});

                if(dbProduct){
                    dbProduct.active = false;

                    const updatedProduct = await dbProduct.save();
                    return updatedProduct;
                }
                else{
                    throw new Error("This product doesn't belong to your company");
                }
            } catch (error) {
                throw new Error(error);
            }
        }
	}
};

module.exports = resolvers;
