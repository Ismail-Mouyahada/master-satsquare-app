# Use a Node.js image as the base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if they exist)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# # Generate Prisma client
# RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# # Push database schema changes
# RUN npx prisma db push

# # Seed the database
# RUN npx prisma seed

# Expose port 3000 for Next.js and 5157 for any other service
EXPOSE 3000 5157

# Start the application
CMD ["npm", "start"]
