
# Use Node base image
FROM node:18-alpine


# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy remaining source files
COPY . .

# Expose backend port (update if using different)
EXPOSE 5000

# Start your app
CMD ["node", "index.js"]
