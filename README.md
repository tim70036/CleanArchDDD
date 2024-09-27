# clean-arch-ddd

Illustrate Clean Architecture and Domain Driven Design through TypeScript implementation. Can be used as starter
template for future application.

## Prerequisites

First, ensure that you are using a machine meeting the following requirements:

- Have `docker` and `docker-compose` installed.
- If you want to run locally, you need to have `node` 20.11 and `npm` installed.
- Have a keyboard for you to type command.
- Chill enough.

## Configure Environment Variables

The project uses the [dotenv](https://www.npmjs.com/package/dotenv) package to manage environment variables.
This package looks for a file named `.env` in the root of the project and loads the environment variables from it.
This file is not committed to the repository and is used to store sensitive information such as API keys and secrets.
You can find a sample of the `.env` file in the `.env.example` file.

## Running the build using docker-compose

Run `docker-compose build` and `docker-compose up -d` to run the tool.
Docker will read environment variables from the `.env` file and use them to configure the application.

## Running the build locally

All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.
This is nice because most JavaScript tools have easy to use command line utilities allowing us to not need grunt or gulp
to manage our builds.
If you open `package.json`, you will see a `scripts` section with all the different scripts you can call.
To call a script, simply run `npm run <script-name>` from the command line.
You'll notice that npm scripts can call each other which makes it easy to compose complex builds out of simple
individual build scripts.
Below is a list of all the scripts this template has available:
| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `lint` | Runs Prettier & ESLint on project files (inside `src/` folder). Make sure run this before submitting your code for merge
request. |
| `build` | Compiles all source `.ts` files to `.js` files in the `build` folder |
| `test` | Runs tests. |
| `dev` | Runs the build app in development mode. Useful for local development. |

Run the build using `npm run build` and `npm run start`.

## Project Structure

| Name               | Description                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------- |
| **build**          | Contains the distributable (or output) from your TypeScript build. This is the code you ship |
| **node_modules**   | Contains all your npm dependencies                                                           |
| **src**            | Contains your source code that will be compiled to the build dir                             |
| **src/App.ts**     | Entry point to your express app                                                              |
| .vscode            | Contains VS Code specific settings                                                           |
| .gitlab-ci.yml     | Used to configure Gitlab CI/CD build                                                         |
| .gitignore         | File to exclude from git version control                                                     |
| package.json       | File that contains npm dependencies as                                                       |
| tsconfig.json      | Config settings for compiling server code written in TypeScript                              |
| .eslint.config.mjs | Config settings for ESLint code style checking                                               |
