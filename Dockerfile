FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . /usr/src/app

RUN npm install -g cross-env
RUN yarn

LABEL name="frontend"

EXPOSE 3000
CMD [ "cross-env", "HOST=0.0.0.0", "yarn", "start" ]
