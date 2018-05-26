#!/bin/bash

docker --version  # document the version travis is using

pip install --user awscli # install aws cli w/o sudo

export PATH=$PATH:$HOME/.local/bin # put aws in the path

echo 'Log in...'
eval $(aws ecr get-login --no-include-email --region us-east-1) #needs AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY envvars

echo 'Building...'
docker build -t v2land-frontend:latest
docker tag v2land-frontend:latest 098553434883.dkr.ecr.us-east-1.amazonaws.com/v2land-frontend:latest

echo 'Pushing...'
docker push 098553434883.dkr.ecr.us-east-1.amazonaws.com/v2land-frontend:latest

