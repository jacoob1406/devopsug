#!/bin/sh

cd mybackend
docker build -t jakublem/mybackend .
docker push jakublem/mybackend:latest
cd ..

kubectl apply -f mybackend-deployment.yml
kubectl apply -f mybackend-service-clusterip.yml
kubectl apply -f ingress-service.yml 