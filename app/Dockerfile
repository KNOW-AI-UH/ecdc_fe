FROM node:22-alpine

# Set timezone to Europe/Helsinki
RUN echo "Europe/Helsinki" > /etc/timezone
# RUN dpkg-reconfigure -f noninteractive tzdata
# Set the working directory
WORKDIR /usr/src/app
COPY . .
RUN npm ci

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "prod"]