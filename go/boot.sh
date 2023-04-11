#!/bin/bash

docker container stop simple-to-do
docker container rm simple-to-do
docker build -t simple-to-do .
docker run -p 8080:8080 --name simple-to-do simple-to-do /main
