FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

# Install app dependencies
RUN npm install -g yarn
RUN yarn
RUN yarn run build

LABEL name="frontend"

EXPOSE 3000
CMD [ "yarn", "start" ]
