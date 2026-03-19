import jwt from 'jsonwebtoken';
import generateRandomAnimalName from 'random-animal-name-generator';

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const UserName = () => {
  const animalName = generateRandomAnimalName();
  const randomNumber = Math.floor(100 + Math.random() * 900);
  const animalNameWithDigits = `${animalName}${randomNumber}`;
  return animalNameWithDigits.split(' ')[1];
}
