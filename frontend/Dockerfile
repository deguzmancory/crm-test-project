# Use Node.js as base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the correct port
EXPOSE 5173

# Start Next.js in development mode with the correct port
CMD ["sh", "-c", "npm run dev -- --port 5173"]
