# backend-prototype

## Prerequisites

First, ensure that you are using a machine meeting the following requirements:

* Have Node.js `14` up. If not, use nvm to install Node.js.
* Have a keyboard for you to type command.
* Chill enough.

Next, run `npm install` to install all packages including TypeScript.

## Running the build
All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.
This is nice because most JavaScript tools have easy to use command line utilities allowing us to not need grunt or gulp to manage our builds.
If you open `package.json`, you will see a `scripts` section with all the different scripts you can call.
To call a script, simply run `npm run <script-name>` from the command line.
You'll notice that npm scripts can call each other which makes it easy to compose complex builds out of simple individual build scripts.
Below is a list of all the scripts this template has available:


| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `lint`                    | Runs ESLint on project files (inside `src/` folder). Make sure run this before submitting your code for merge request. |
| `build`                   | Compiles all source `.ts` files to `.js` files in the `build` folder                              |
| `test`                    | Runs tests.                                                                                       |
| `dev`                     | Runs the build app in development mode. Useful for local development.                             |
| `start`                   | Run the built app in production mode. (using PM2).                                                |


## Project Structure
| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **build**                | Contains the distributable (or output) from your TypeScript build. This is the code you ship  |
| **node_modules**         | Contains all your npm dependencies                                                            |
| **src**                  | Contains your source code that will be compiled to the build dir                              |
| **src/App.ts**           | Entry point to your express app                                                               |
| **pm2.config.js**        | Configuration for running pm2 in production. (See npm script settings)                        |
| .vscode                  | Contains VS Code specific settings                                                            |
| .gitlab-ci.yml           | Used to configure Gitlab CI/CD build                                                          |
| .gitignore               | File to exclude from git version control                                                      |
| package.json             | File that contains npm dependencies as                                                        |
| tsconfig.json            | Config settings for compiling server code written in TypeScript                               |
| .eslintrc.js             | Config settings for ESLint code style checking                                                |