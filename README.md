# appengine-express-cms

Example CMS using the following technologies:
* AppEngine
* Datastore
* NodeJS
* Express

## Installation

Ensure you have Node and NPM installed using the instructions at:

[https://nodejs.org/download/](https://nodejs.org/download/)

Install the project dependancies using:

    npm install

Create a file at /config.json containing your settings:

    {
        "CLOUD_BUCKET": "your-bucket-name",
        "GCLOUD_PROJECT": "your-gcloud-project-name",
        "DATA_BACKEND": "datastore",
        "MEMCACHE_URL": "[YOUR_MEMCACHE_URL]",
        "OAUTH2_CLIENT_ID": "[YOUR_OAUTH2_CLIENT_ID]",
        "OAUTH2_CLIENT_SECRET": "[YOUR_OAUTH2_CLIENT_SECRET]",
        "OAUTH2_CALLBACK": "http://localhost:8080/auth/google/callback",
    }

You can follow the guide at:
https://cloud.google.com/appengine/docs/flexible/nodejs/authenticating-users

## Usage

Run the local server using the command:

    npm start

Then view the site at:

    http://localhost:8080/


## Deployment

Use the build command to optimise

    npm run build


## Directory structure

    pages/                       --> API
    static/                      --> Static assets
    templates/                   --> Dynamic templates
    test/                        --> Tests


## Contact

For more information please contact kmturley