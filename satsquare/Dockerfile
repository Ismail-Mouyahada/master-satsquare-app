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

# Build-time arguments for environment variables
ARG DATABASE_URL

ARG NEXT_AUTH_SECRET

ARG NEXT_PUBLIC_SITE_URL

ARG NEXT_PUBLIC_SOCKET_URL

# Set environment variables based on build-time arguments
ENV database_url=${DATABASE_URL}

ENV next_auth_secret=${NEXT_AUTH_SECRET}

ENV next_public_site_url=${NEXT_PUBLIC_SITE_URL}

ENV next_public_socket_url=${NEXT_PUBLIC_SOCKET_URL}

# Generate Prisma client
RUN npx prisma generate

# Push database schema changes
RUN npx prisma db push

# Seed the database
#RUN npm run seed

# Build the Next.js application
RUN npm run build

# Expose port 3000 for Next.js and 5157 for any other service
EXPOSE 3000 5157

# Start the application
ENTRYPOINT ["npm", "run","all-dev"]
