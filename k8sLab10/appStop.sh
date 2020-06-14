#!/bin/sh

kubectl delete ingress ingress-service
kubectl delete svc mybackend-service
kubectl delete deploy my-backend-deployment
