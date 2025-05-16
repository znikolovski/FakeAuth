# FakeAuth

Welcome to FakeAuth - the realest (fake) auth service to use in your demos! FakeAuth implements a proper JWT based authentication flow so it mimics a real authentication process. It is powered by [Adobe AppBuilder](https://developer.adobe.com/app-builder/) and [Neon Tech](https://neon.tech/).

FakeAuth supports the following mechanisms:
- Authentication - used to authenticate users
- Registration - used to register new users
- Verify - used to verify if the current user is logged in (can be used to mimic single sign-on workflows)

## Setup

- Register for a [Neon Tech](https://neon.tech/) account - you can use the free tier.
- Populate the `.env` file in the project root and add a `DATABASE_URL` entry which points to your Neon DB
- Deploy in AppBuilder - this will create the endpoints you will need to implement the above mentioned mechanisms

I've included a sample query file to bootstrap the Neon database but you can add your own fields in the schemas (please note that this will require you to update the action logic to accommodate the new fields).

## Usage
- In your code you should implement two functions
  - `authenticate()` which will handle the authentication
  - `validateAuth()` which will handle the verify mechanism
  - `register()` which will handle the ability to register a new user

*Please note that the names of the functions above are arbitrary*

For an account registration workflow we strongly recommend using AEM Forms. You can see an example of this here: https://main--securbank-aem-ue--znikolovski.hlx.live/account-registration

The form for a registration requires the following fields:
- Identifier (email address)
- Password
- First Name
- Last name

Once the form is created the submit action should be the following:
- Submit Action: Submit to REST endpoint
- URL: The URL of the create AppBuilder endpoint (which you would receive once deployed to AppBuilder)

