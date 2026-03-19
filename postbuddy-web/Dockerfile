# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install all dependencies, including devDependencies, as `tailwindcss` is needed for the build process
RUN npm install --force

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js app
RUN npm run build

# Remove devDependencies after build to reduce image size
RUN npm prune --production --legacy-peer-deps

# Expose the port that the Next.js app will run on
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["npm", "run", "start"]
