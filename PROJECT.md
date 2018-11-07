# {{human-name}} - Development environment

> Docker development environment for `{{name}}`. Started with [rebirth-typo3-dev](https://github.com/joonasy/rebirth-typo3-dev.git). 

# Requirements

* GNU/Linux/Unix with Docker ([Docker toolbox](https://www.docker.com/products/docker-toolbox), [Vagrant](https://www.vagrantup.com/downloads.html) VM with Docker, [native Linux with Docker](http://docs.docker.com/linux/step_one/) or [Docker for Mac](https://docs.docker.com/docker-for-mac/)).
* [docker-compose](https://github.com/docker/compose)
* [Node.js](http://nodejs.org/)
* [Yarn](https://yarnpkg.com)
* SSH access (RSA Key Pair) and [rsync](https://linux.die.net/man/1/rsync) (Optional but required for syncing assets and databases)

# Installation 

**1. Clone this repository recursively**

```
$ git clone git@bitbucket.org:{{author}}/{{name}}.git
```

**2. Prepare for installation** 

1. Copy [`.env.example`](.env.example) to `.env` file and set your environment variables. Most of the vars should already be set by the creator of the project. Especially make sure that all the `PRODUCTION_*` vars are set (e.g `PRODUCTION_PASSWORD`). 

2. Make sure docker is running

**3. Install**

1. Clone production environment to your local development environment (requires SSH access and production server credentials):

```
$ make start-clone
```

2. Or kickstart your project:

```
$ make start
```

Crab a cup of :coffee: as the installation process may take a while. If you are not able to run these please refer to the [Makefile](Makefile) and run the commands manually.

**4. Navigate to [127.0.0.1:8000](http://127.0.0.1:8000) and setup TYPO3**

Login to TYPO3 and setup your newly created site if you kickstarted the project, otherwise just login with the production credentials and verify everything works properly. 

**5. Start extension development**

Go to `/web/typo3conf/ext/{{extension-dir}}` to learn about the theme development and deployment. 

# Usage

All the commands are near equivalents to `$ docker` / `$ docker-compose` commands and `$ npm ...` scripts. If you are not able to run these please refer to the [Makefile](Makefile), [package.json](package.json) (npm scripts), [Docker compose reference](https://docs.docker.com/compose/reference) and [Docker CLI](https://docs.docker.com/engine/reference/commandline/). 

## Local commands

These commands are for setting up your local development environment.

#### `$ make start`

Kickstart your project from scratch. Builds, creates and starts Docker containers, creates fresh database and updates all dependencies. 

#### `$ make start-clone`

Clone production environment to your local development environment. Builds, creates and starts Docker containers, updates all dependencies, pulls assets, pulls MySQL dump, replaces local database with the remote database. Make sure database server credentials are set in the `.env` file.

#### `$ make up`

Starts Docker containers. Use this to resume developing after installing the project. 

#### `$ make stop`

Stop Docker containers.

#### `$ make update`

Update development dependencies (Yarn, Composer).

#### `$ make rebuild`

Rebuild TYPO3 (`app`) container.

#### `$ make rebuild`

Rebuilds and reinstall containers, including your MySQL container (Note that you will lose your current data).

#### `$ make web`

Connect to TYPO3 (`web`) container.

#### `$ make db`

Connect to MySQL (`db`) container.

#### `$ make assets-pull`

Pull uploaded files from production environment (`uploads/`  folder etc.) to your local environment.

#### `$ make db-pull`

Backup your mysql container database to `database/local/`.

#### `$ make db-pull`

Create and pull MySQL dump from the production environment to the `database/remote` folder, backup current database to  `database/local` folder and places the pulled dump ready for replacing (`database/typo3.sql`). Make sure database server credentials are set in the `.env` file.

#### `$ make db-replace`

Backups current database and replaces it with `database/typo3.sql` dump. 

#### `$ make db-replace-clone`

Shorcut for `$ make db-pull` & `$ make db-replace`.

## Remote commands

**:warning: Be extremely careful with the remote commands or you may break the server configuration! You need SSH access (RSA Key Pair) for the remote commands.** Make sure all the production server credentials are set in the `.env` file.

#### `$ make production-start`

Install TYPO3 to the production server. This is most likely **required only once**, so be careful not to reinstall accidentally. After TYPO3 is installed, head to your remote url and setup TYPO3.

You may want to:

* Deploy your extension first
* `$ make production-db-replace`: Replace remote database with your local one. Make sure the database name matches with the remote in `.env` (`PRODUCTION_DB_NAME`)
* `$ make production-assets-push` to sync your local materials to the server

If you want to add new new server environments (e.g. stage) you need to modify [flightplan.remote.js](flightplan.remote.js), [flightplan.config.js](flightplan.config.js), [Makefile](Makefile), [package.json](package.json), [.env](.env) and [.env.example](.env.example) files. 

#### `$ make production-db-replace`

Creates dump of your local database and replaces production database with the newly created dump. 

#### `$ make production-update`

Update TYPO3 Composer dependencies.

#### `$ make production-assets-push`

Push your local assets to the production server.

---

You may learn more about the project structure in [Rebirth — TYPO3 Development Environment](https://github.com/joonasy/rebirth-typo3-dev)
