# Throner API

REST API with Node.js and MongoDB to manage data for Throner project

### Description
It's expose CRUD endpoints for the following resources:

* **Pictures:** Store pictures taken with the camera of the drone and give the ability to retrieve them
* **Position** Receive drone position periodically and store in the database. We will retrieve them after to display the path on Google Maps
* **Settings:** Save drone configuration like Stream URL who contains the URL to stream camera of the drone through the web

### Installation
```
git clone https://github.com/tericcabrel/throner-api.git
yarn install
cp .env.example .env
nano .env
```

### Start the server
```
yarn start
```

The server will run on port 5991. You can change this by editing `.env` file.

### Project
To view all the repositories involved on this project, follow the link below<br>
[View Throner project](https://github.com/tericcabrel/throner)
