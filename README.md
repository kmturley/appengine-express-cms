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
        "GCLOUD_PROJECT": "your-gcloud-project-name",
        "DATA_BACKEND": "datastore"
    }

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
    test/                        --> Tests
    views/                       --> Frontend templates


## Contact

For more information please contact kmturley