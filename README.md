# Misfit

Misfit provides a command line-based UI for performing common npm tasks.  Currently, its only feature is listing the [npm scripts](https://docs.npmjs.com/cli/run-script) for the current working directory, from which you can can select and run the scripts.

I started this project so that I wouldn't have to remember script names for different projects and could just select them from a list.  More features may be added in the future.

## Installation

````
npm install -g misfit
````

## Usage

````
cd some/project/root
misfit
````

## Supported platforms

Misfit was developed on OS X, but it'll probably also work on Linux.  Windows has not been tested, but I'm happy to accept a Pull Request to support it.

Misfit currently only searches the current working directory for a `package.json` file.

## Why "Misfit?"

Because [npm-ui](https://github.com/chbrown/npm-ui) and [npm-gui](https://github.com/q-nick/npm-gui) were already taken and I was listening to the Misfits when I started this project.  By the way, [Famous Monsters](https://en.wikipedia.org/wiki/Famous_Monsters) is a really good album.
