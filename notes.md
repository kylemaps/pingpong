hi so this is what i did

1) created a repo sa github https://github.com/kylemaps/pingpong (based on the name sa exercise as suggested)
2) git init sa folder ng ni copy ko na base template for the app (that's app2 for u)
3) git push to https://github.com/kylemaps/pingpong
4) i then ran `docker build -t kylmps/pingpong:1.0 .` I remembered bakay kaya di natatag kasi nga nauuba ko i create bago itag
5) then `docker push kylmps/pingpong:1.0`
6) then `kubectl create deployment pingpong-dep --image=kylmps/pingpong:1.0`
7) then `kubectl get pods`
8) checked logs if it is working `kubectl logs -f pingpong-dep-6b9d65bbcd-8v4p4`

this has become the reader file as of Exercise 1.10: Even more services

Hi so I made a choice it is either I modify the app to accept /pingpong or /ping or do this:

This is path rewriting usin nginx since it is not part of the gce i should install it to my cluster using this:
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

then use it in my ingress.yaml:
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: log-output-ingress
  namespace: app-exercises
  annotations:
    kubernetes.io/ingress.class: "nginx"  # Use Nginx Ingress Controller
    nginx.ingress.kubernetes.io/rewrite-target: /ping  # Rewrite /pingpong -> /ping
spec:
  rules:
    - http:
        paths:
          - path: /log-output
            pathType: Prefix
            backend:
              service:
                name: log-output-svc
                port:
                  number: 3002
          - path: /pingpong  # External users visit /pingpong
            pathType: Prefix
            backend:
              service:
                name: pingpong-svc
                port:
                  number: 3001

okay i dont think you'll remember this but here is the answer:
"Note that Ingress expects a service to give a successful response in the path / even if the service is mapped to some other path!"
"The Ingress performs health checks by GET requesting / and expects an HTTP 200 response." this is from the website mismo, the thing is u should edit the code to respond 200 kasi yun hinahanap, it was marked unhealthy for so long kasi di sya nag rerespond ng 200. Ayun lang naging fix. 