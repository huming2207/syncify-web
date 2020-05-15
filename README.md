# Syncify - Web App

Yet another self-deployable/self-hosted Storage-as-a-Service and data syncing platform

By Jackson Ming Hu (s3554025), for RMIT [Cloud Computing](http://www1.rmit.edu.au/courses/049803) Assignment 2.

## Environment requirements

- Node
    - Node v12 LTS is required, for ES2019 support
- VSCode with Vetur plugin installed

## API server

See [https://github.com/huming2207/syncify](https://github.com/huming2207/syncify)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Docker setup

1. Run this to build docker image: `docker build -t syncify-web .`
2. Then do `docker run -p 80:80 syncify-web`
3. Enjoy!
