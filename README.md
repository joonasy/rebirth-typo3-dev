# Rebirth — TYPO3 Development Environment

This is a modern TYPO3 v^8.7.8 stack designed to work with [Rebirth](https://github.com/joonasy/rebirth) that helps you get started with the best development tools and project structure.

## Features

* Easy TYPO3 configuration with environment specific files
* Environment variables with [Dotenv](https://github.com/vlucas/phpdotenv) & [dotenv](https://github.com/motdotla/dotenv#readme) for deployments
* Uses composer for installing extensions. Includes useful extensions out of the box.
* Automatic TYPO3 installation to remote location
* Scripts for deploying databases and assets to remote locations
* Scripts for pulling assets and databases from remote locations

## Requirements

* GNU/Linux/Unix with Docker ([Docker toolbox](https://www.docker.com/products/docker-toolbox), [Vagrant](https://www.vagrantup.com/downloads.html) VM with Docker, [native Linux with Docker](http://docs.docker.com/linux/step_one/) or [Docker for Mac](https://docs.docker.com/docker-for-mac/)).
* [docker-compose](https://github.com/docker/compose)
* [Node.js](http://nodejs.org/)
* [Npm](https://npmpkg.com)

## Quick start

Quickly install with [create-project](https://github.com/mafintosh/create-project). Add your values to the following one-liner: 

```
$ npx create-project my-project-dir-dev joonasy/rebirth-typo3-dev --human-name="My Project" --extension-dir=my-extension-dir --author=joonasy --production-url=https://my-project.com
```

After the installation is done jump to phase 3 in the next section.

## Getting started

This development template assumes that you are using [Rebirth](https://github.com/joonasy/rebirth) to develop your extension. However it is not required and you may use any extension you like.

**1. Clone this git repository and create your project folder**

    $ git clone https://github.com/joonasy/rebirth-typo3-dev.git my-project-dir-dev

**2. Replace all of the following variables in all the project files with _machine readable format_**

* `{{name}}`: This is your project name (e.g. `my-project-dir-dev`; It's recommended to use same name as your project folders name which you created above. This should also be used for git urls).   
* `{{human-name}}`: This is your project human readable name (e.g. `My Project`).
* `{{extension-dir}}`: This will be your extension directory which will be generated later (e.g. `myextension`)
* `{{author}}`: Author of this project (e.g. `joonasy`)
* `{{production-url}}`: Website url of the project in which the app will be published (e.g. `https://project-name.com`) 

**3. Install extension with Rebirth Yeoman generator**

If you don't want to use Rebirth you can skip this step.

1. Navigate to `web/typo3conf/ext/`
2. Create your extension with [Rebirth Yeoman Generator](https://github.com/joonasy/generator-rebirth) and make sure the previously added {{extension-dir}} matches with the generated project name. 

```
$ npm install yo -g && npm install generator-rebirth -g
$ yo rebirth {{extension-dir}} --project=typo3
```

**4. Install all the dependencies and kickstart the project**

1. Copy `.env.example` to `.env` and setup your environment variables
2. Make sure docker is running as the following command will require it

```
$ make start
```

Crab a cup of :coffee: as the installation process may take a while. If you are not able to run these please refer to the [Makefile](Makefile) and run the commands manually.

After the installation is done, navigate to [PROJECT.md](PROJECT.md) to learn about further installation process and available commands.

**5. Clean up & recommended actions**

Run `$ make bootstrap`. Note that the script will remove this file and rename `PROJECT.MD` to `README.md`. See the new [README.md](README.md) to learn about further installation process, available commands and make sure it contains correct information such as remote git links.

Happy developing!

## Changelog

See [CHANGELOG.md](/CHANGELOG.md)

## FAQ

### Should `web/typo3conf/ext` be ignored?

By default `web/typo3conf/ext` is not ignored by git because we want to keep things simple by keeping all the development material in the same repository. If you don't want this development repository to track theme related changes just add the following to `.gitignore` and remember to document on how to pull your extension.

```
web/typo3conf/ext/*
!web/typo3conf/ext/.gitkeep
```


### I cannot clone a private bitbucket repository w/ composer (e.g. `$ make update`)

This could be an issue with [OSX users](https://github.com/docker/for-mac/issues/410). The easiest way to solve this is to use bitbuckets "App Password" [solution](https://stackoverflow.com/questions/23391839/clone-private-git-repo-with-dockerfile):

1. Go to your App Password settings: `Bitbucket settings -> Access Management -> App Password`
2. Create a password and give it all the permissions. Copy password to your own personal secure location.
3. In `composer.json` replace your private repository url to include your credentials `https://username:app_password@bitbucket.org/author/repository.git`

## License

Copyright (c) 2020 Joonas Ylitalo (Twitter: [@joonasy](https://twitter.com/joonasy)). Licensed under the MIT license.


