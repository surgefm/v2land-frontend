FROM openresty/openresty:trusty

COPY nginx.conf /etc/nginx/conf.d/main.conf

# Create app directory
WORKDIR /usr/src/app

# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

# Install app dependencies
RUN cd /etc
RUN curl -sL https://deb.nodesource.com/setup_9.x | bash -
RUN apt-get install -y nodejs
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn

RUN npm install -g cross-env
RUN yarn
RUN yarn run build



LABEL name="frontend"

EXPOSE 8080
CMD /usr/local/openresty/bin/openresty && cross-env HOST=0.0.0.0 yarn start
