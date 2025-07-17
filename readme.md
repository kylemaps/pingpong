# Ping-Pong Application

This repository contains the source code for the `pingpong-app`, a simple Node.js backend service.

---

## Purpose

This application serves as a stateful counter. It exposes a single API endpoint that, when called, increments a counter in a PostgreSQL database and returns the current count. It is designed to be a dependency for other services that need a simple, persistent counter.

This service is part of a larger system and is consumed by the `log-output-app`.

## Features

-   **Technology**: Built with Node.js and the Koa framework.
-   **Persistence**: Uses a PostgreSQL database to ensure the counter value is not lost on restart.
-   **API Endpoint**: Responds to `GET /ping` by incrementing the counter.
-   **Health Check**: Provides a `GET /healthz` endpoint that verifies the database connection is active, for use with Kubernetes readiness and liveness probes.

## GitOps & Deployment

This is an **Application Repository**. The Kubernetes manifests for deploying this service are managed in a separate **Configuration Repository**: `log-pong-config`.

A CI/CD pipeline is configured via GitHub Actions in this repository. When changes are pushed to the `main` branch:
1.  A new Docker image is automatically built and pushed to Docker Hub.
2.  The pipeline then automatically updates the image tag in the `log-pong-config` repository.
3.  ArgoCD detects this change and deploys the new version to the cluster.
