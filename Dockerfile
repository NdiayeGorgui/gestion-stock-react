# Stage 1: Build React application
FROM node:latest AS build

# Set working directory
WORKDIR /usr/local/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the application
COPY . .

# Build the React app (Vite outputs to /dist)
RUN npm run build

# Stage 2: Serve app with Nginx
FROM nginx:latest

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from Vite
COPY --from=build /usr/local/app/dist /usr/share/nginx/html

# Expose port 
EXPOSE 4300

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
