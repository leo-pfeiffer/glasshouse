# Glasshouse 👁️

[Glasshouse](https://glasshouse.netlify.app/) is a data dashboard where I gather data from apps I use everyday.

GitHub repositories:

- client: [leo-pfeiffer/glasshouse](https://github.com/leo-pfeiffer/glasshouse)
- back-end: [leo-pfeiffer/glasshouse-backend](https://github.com/leo-pfeiffer/glasshouse-backend)

## 🚧 State of the Project

Work in progress!

Currently I've implemented the following data sources:
- Spotify
- Apple Fitness
- WakaTime

I'm thinking about also implementing:
- GitHub

Beyond that, I will likely migrate the project from JavaScript to TypeScript at some point.

### 🔥 Motivation

The project is mainly a fun project that I embarqued on to play with some of the data from the apps I use the most. I wanted to build something that I can easily expand on over time if I want to add new apps.

## 🔧 Technologies

Most of the project is written in JavaScript, although I intend to migrate everything to TypeScript in the near future.

### Back-end
- The server is written with **Node.js** together with **Express** to build the API.
- I use **MongoDB** for persistent storage of my Apple Health Data.
- The back-end runs on on **Google App Engine**.

### Front-end
- The client is written in **Vue.js**.
- I used **Bulma** as a CSS framework.
- The client is hosted on **Netlify**.

## 📐 Architecture

The architecture of the project is somewhat microservice-esque. The different services (i.e. Spotify, WakaTime, ...) aren't actually run in separate containers, but they are implemented in standalone modules for loose coupling. 

The server exposes and API that serves as a gateway to pass requests from the client to the respective services. The following diagram gives an idea of the architecture.

![Architecture of Glasshouse](glasshouse-architecture.png)

## 💡 Implementation & Learnings
Implementing the project was a lot of fun! There were quite some aspects in there that I hadn't dealt with before, so learning about new aspects was great.

As mentioned in the architecure section, the API gateway passes client requests to the appropriate microservices. From there, the microservices take over and fulfil the request in one way or another. 

### Spotify service
For the Spotify service, this meant actually talking to the Spotify Web API and processing the result. Getting the required OAuth authentication just right was very interesting - since I couldn't have the user go through the normal login browser to login (since the service is supposed to be automatic after all). 

I solved this by setting an initial access and refresh token that I retrieved manually. Since the access token expires within 60 minutes, I will have to request a new one - which can be done automatically via the refresh token. This way, the user will not have to physically login again and the service can run in the background.

### Fitness service
The second highlight of the implementation was the integration of the Apple Health data. Unfortunately, Apple doesn't provide a public API to retrieve this data. However, I recently found the Health Auto Export app on the export that allows you to post all your Apple Health data to a REST API or upload it to dropbox. 

Therefore, the fitness service of the project needed to process incoming data from the Health Auto Export app's post requests and store it in the MongoDB. The app allows you to run these exports on a regular basis, so as of now, my Apple Health data is posted to the server once a day. When the client requests the fitness data, the fitness service retrieves it from the MongoDB.

### Caching
To reduce the load on the server and to reduce response time, I implemented caching for all API endpoints. As of now, I use the fairly basic node-cache library, which actually serves the purpose very well. Something more powerful such as Redis would certainly scale better, but for the scope of the application node-cache very much does the trick. 

Caching is handled by the microservices depending on the data requested. For example, the Spotify service caches the top track and top artists data until the end of the day, whereas the recently played and currently playing data is only cached for 30 seconds. This helps the response time of the server while still keeping the data sufficiently up-to-date.

### Deployment
The back-end server is deployed on Google App Engine. This was the first time I used any GCP product, so it took me some time to find my way through the platform, but I eventually managed! 

I ran into a curious issue when I tried to figure out how to set my environment variables (stored in a `.env` file) during my CI/CD workflow on GitHub. App Engine asks you to deliver an `app.yaml` file, in which these can be specified. But since the `.env` file contains private API keys, I'd rather not push it to my public repo.

I eventually solved this by setting a base64 encoded version of my `.env` file as a secret in the GitHub action workflow. During the deployment, the `app.yaml` file is created dynamically by decoding the secret and appending it to the rest of the `app.yaml` file. This is certainly a bit of a hack but it saved me from having to add a dozen environment variables as separate secrets. It's not pretty - but it works and is certainly better than commiting my `.env` file. 


## 📚 Resources
+ [Health Auto Export App](https://www.healthexportapp.com/)
+ [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
+ [WakaTime API](https://wakatime.com/developers)
+ [MongoDB](https://www.mongodb.com/)
+ [Google App Engine](https://cloud.google.com/appengine)
+ [Netlify](https://www.netlify.com)
+ [Bulma](https://bulma.io/)
