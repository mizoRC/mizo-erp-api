import { withFilter } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../../server';
import User from '../../models/User';

const resolvers = {
	Query: {
		me: async (root, {  }, context) => {
            return 'TO-DO';
            /* const user = await getUserFromJWT(context.req);
            if (!user) {
                throw new AuthError(440, 'Invalid token');
            }

            const result = await User.findOne({
                where: {
                    id: user.id
                }
            });

            createUserEvidence(EvidenceLog, user, 'LOGIN');

            User.update({
                lastConnectionDate: new Date().toISOString()
            }, {
                    where: {
                        id: user.id
                    }
                });
            return result; */
        }
	},
	Mutation: {
        login: async (root, { email, password }, context) => {
			try {
                const user = await User.findOne({where: {email: email}});
                const match = await bcrypt.compare(password, user.password);
                console.log('USER', user);
                console.log('MATCH', match);
                if(match && user.active == 1){
                    const token = jwt.sign({user: user}, 'secret', { expiresIn: 60 * 60 * 8}); //16H
                    return { token };
                }
                else{
                    throw new Error('Invalid user');
                }
			} catch (error) {
				throw new Error(error);
			}
		}
	}
};

module.exports = resolvers;
