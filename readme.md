# Pingpong Application

## Overview
The **Pingpong** application is a simple service that:
- **Responds to GET `/ping`** with a counter (`pong 0`, `pong 1`, `pong 2`, etc.).
- **Stores counter in a database** (PostgreSQL for persistence across restarts).
- **Shares an Ingress path (`/pingpong`)** with the Log Output app.

This application was developed incrementally following various exercises in **DevOps with Kubernetes**.

---

## 🚀 **Progression of the App**
### **Exercise 1.09: First Version**
- Created a **simple Node.js app** that responded with `"pong 0"`.
- Counter was stored **in memory** (reset on pod restart).
- Shared **Ingress** with Log Output.

### **Exercise 1.10: Connecting Log Output**
- Log Output **fetches the counter over HTTP** (`http://pingpong-svc:3001/ping`).

### **Exercise 2.07: Adding a Database**
- Integrated **PostgreSQL** to store the counter.
- **Ensured database table exists on startup** (`counters` table).

### **Exercise 3.01: Deploying to GKE**
- Changed **Service type to LoadBalancer**.
- Exposed `/pingpong` via **Ingress**.

### **Exercise 3.02: Fixing Ingress Path**
- Issue: **Ingress expected `/` to return HTTP 200.**
- Fix: Modified the app to **respond with HTTP 200 at `/`**.

### **Exercise 3.06: DBaaS vs DIY**
#### **Comparison of Database Solutions**
When choosing between **Database-as-a-Service (DBaaS)** and **Self-Managed Databases (DIY)**, there are key considerations:

| Criteria             | DBaaS (e.g., Google Cloud SQL) | DIY (Self-Hosted PostgreSQL) |
|----------------------|------------------------------|-----------------------------|
| **Setup Complexity** | Minimal (Fully Managed)      | High (Manual Installation & Config) |
| **Maintenance**      | Automatic Updates, Patches  | Manual Updates, Potential Downtime |
| **Backup & Recovery** | Built-in, Automated Snapshots | Requires Custom Backup Scripts |
| **Scaling**         | Auto-Scaling Available      | Requires Manual Scaling |
| **Security**         | Managed Access Control, IAM | Must Configure Firewalls & User Access |
| **Cost**            | Higher (Pay per use)        | Lower but requires manual oversight |
| **Customization**    | Limited Customization      | Full Control Over Configurations |

#### **Conclusion**
- **DBaaS is ideal for teams that want ease of use, automatic maintenance, and reliability.**
- **DIY is better for cost savings, full control, and custom configurations, but requires significant effort.**

---

## 🛠 **Setup & Deployment**
### **Build & Push Docker Image**
```sh
docker build -t kylmps/pingpong:latest .
docker push kylmps/pingpong:latest
```

### **Deploy to Kubernetes**
```sh
kubectl apply -k .
```

### **Check Services**
```sh
kubectl get services -o wide
```

### **Test the Application**
```sh
curl http://<EXTERNAL_IP>/pingpong
```
Expected output:
```json
{ "count": 3 }
```

---

## 🔥 **Learnings**
- **Ingress expects HTTP 200 at `/`.**
- **Database persistence ensures counter survives pod restarts.**
- **Google Cloud Load Balancer handles Ingress traffic.**

🚀 **Now, the Pingpong application is fully automated and cloud-deployed!**



## when applying
kubectl apply -f db/
<!-- kubectl apply -f manifests/svc-ing.yaml -->
kubectl apply -f manifests/deployment.yaml