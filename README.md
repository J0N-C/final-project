# Recipe-deck

A web application for people who want to save a deck of their own recipe cards, that they can view and search through.

The idea for this project began while I was viewing online recipes, realizing I was tired of scrolling down through lines of the recipe writer's backstory, and various ad windows or popups, before getting to the recipe. Then, after reaching the recipe, I would have to find where to download just the ingredients and instructions, or print the recipe as a pdf if no download is offered, to be able to save it on my own computer and view again later while cooking without scrolling through all the above again. Each site then had their own login, and there was no centralized way to organize all the recipes you had, as well as make edits or notes based on your preferences. The "card" idea came as I thought of back when I subscribed to a meal kit delivery service, they provided simple printed cardstock recipes for their provided ingredients. So I thought, it be nice to be able to write your own digital recipe card while drawing inspiration from a recipe viewed online, saved in a consolidated deck, that you could review again and make changes to at any time.

## Link to live deployment:
https://recipe-deck.herokuapp.com/

Note: When registering, the sign-in/sign-up pages are intended to be for proof of concept, and emails are for identification purposes only. I recommend using a fake or placeholder email and password if you would like to register a new user for testing. The database may be irregularly reset as I continue testing and developing, so please do not save any important information within.

## Technologies Used:
* JavaScript
* CSS3
* HTML5
* Node.js
* npm
* nodemon
* Babel
* React
* React-dom
* Bootstrap
* Express
* PostgresQL
* dotenv
* webpack
* argon2
* jsonwebtoken
* Heroku

## Features implemented:
* User can add and save a recipe
* User can view their saved recipes
* User can edit their saved recipes
* User can delete their saved recipes
* User can update when they have last made a recipe
* User can sort their view of their saved recipes
* User can search their saved recipes with specific keywords by name, ingredient, or tags
* Users can log in to manage their recipes or log out when they are done

## Preview:
### Responsive layout & Usage Demo:
![demo gif](https://github.com/J0N-C/recipe-deck/blob/master/readme-demo/recipe-deck-responsive-demo.gif "demo gif")

## Stretch Features:
* User can check off which ingredient and instruction step they have completed as they cook to keep track of where they are
* User can click a tag in a recipe to quickly find other recipes with the same tag
* User can upload more than one image to their recipe and can reorder images

## System Requirements:
To view the webpage: Any web browser that supports HTML5, CSS3, and ECMAScript 2015 (ES6)
* argon2 0.28.3 or higher
* dotenv 16.0.0 or higher
* express 4.17.1 or higher
* jsonwebtoken 8.5.1 or higher
* pg 8.6.0 or higher
* react 17.0.2 or higher
* react-dom 17.0. or higher
* @babel/core 7.16.12 or higher
* @babel/plugin-transform-react-jsx 7.16.7 or higher
* babel-loader 8.2.3 or higher
* nodemon 2.0.15 or higher
* npm-run-all 4.1.5 or higher
* webpack 5.68.0 or higher
* webpack-cli 4.9.2 or higher
* webpack-dev-server 4.7.4 or higher

### Getting Started

1. Clone the repository.

    ```shell
    git clone https://github.com/J0N-C/recipe-deck.git
    cd recipe-deck
    ```

1. Install all dependencies with NPM.

    ```shell
    npm install
    ```

1. Initialize the PostgreSQL server.
    * To start
    ```shell
    sudo service postgresql start
    ```

    * To view status
    ```shell
    sudo service postgresql status
    ```

    * To stop
    ```shell
    sudo service postgresql stop
    ```

1. In a separate terminal, start the pgweb GUI tool. Once started, visit http://localhost:8081 to view

    ```shell
    pgweb --db=recipe-deck
    ```

1. In a separate terminal, start the dev server. Once started you can view the application by opening http://localhost:3000 in your browser.
    ```shell
    pgweb npm run dev
    ```
