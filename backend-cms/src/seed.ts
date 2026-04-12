import { Payload } from "payload";
import { User } from './payload-types';

export const seed = async (payload: Payload) => {

  const existUser = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: 'jordan@gmail.com'
      }
    }
  });
  if (existUser) {
    console.log('User already exists');
    return;
  }

  await payload.create({
    collection: 'users',
    data: {
      email: 'jordan@gmail.com',
      password: '123',
      name: 'Jordan',
      roles: ['admin']
    }
  });
}