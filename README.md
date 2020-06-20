# Apollo GraphQL Server for TheMealDB
#### TheMealDB: https://www.themealdb.com/
----
Hello there! This is the backend for my Recipe Box app. I am doing two things with this server:
* Building on my knowledge from [my last Apollo server](https://github.com/willowell/Apollo-GraphQL-Server-for-REST-Countries).
* Working on [this project](https://github.com/florinpop17/app-ideas/blob/master/Projects/1-Beginner/Recipe-App.md) for my portfolio.

While I intend for this Apollo server to be a backend for my web app, I have made it general enough that you can use it for more than just a backend for a web app. For instance, you could incorporate this into a larger server with more features (like handling users, connecting to AWS, etc.), or you could translate this into an Apollo server for another language/platform.
----
#### Features
* (TODO) Adheres to Standard JS.
* (TODO) Fully typed with TypeScript and `@graphql-codegen`.
* Lodash because I love functional programming.
* Schema and example queries live in separate `.graphql` files in the graphql folder.
* Schema covers all fields TheMealDB has to offer.
* `enum` type for Area.
* There are `get` methods in the `MealsAPI` class and corresponding resolvers for *almost* every endpoint TheMealDB has, including the Patreon-only endpoints. All you need to do is add your API key to a `.env` file in the root directory. 
----
#### Environment Details
* NodeJS version: 14.4.0
* npm version: 6.14.5
----
#### Build Instructions
To build and run this server on your machine:
1. Clone or download this repository.
2. `cd` into the directory and run `yarn`.
3. Run `yarn start` to start the server.
4. If all went well, the server will be ready at http://localhost:4000/.
5. Enjoy!!

If you have any problems, questions, suggestions, or critiques, please open an issue on this repository!