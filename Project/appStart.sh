#!/bin/sh

cd backend
docker build -t jakublem/mybackend .
docker push jakublem/mybackend:latest
cd ..

cd frontend
docker build -t jakublem/myfrontend .
docker push jakublem/myfrontend
cd ..

cd k8s 

kubectl apply -f myapp-configmap.yml

kubectl apply -f dnsutils.yml

kubectl apply -f redis-deployment.yml
kubectl apply -f redis-service-clusterip.yml

kubectl apply -f postgres-pvc.yml
kubectl apply -f postgres-secret.yml
kubectl apply -f postgres-deployment.yml
kubectl apply -f postgres-service-clusterip.yml

kubectl apply -f mybackend-deployment.yml
kubectl apply -f mybackend-service-clusterip.yml

kubectl apply -f frontend-deployment.yml
kubectl apply -f frontend-service-clusterip.yml

kubectl apply -f ingress-service.yml 

cd ..
