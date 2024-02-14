# Use the specific Node.js version
FROM node:20.11.0

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code into the container
COPY . .

# Expose the port Vite uses (default is 3000, change if yours is different)
EXPOSE 5173

# Start command
CMD ["npm", "run", "dev"]
