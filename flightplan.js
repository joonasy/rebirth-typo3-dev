require('dotenv').config();
const plan = require('flightplan');
const cfg = require('./flightplan.config');


/* ======
 * Config
 * ====== */

/**
 * Target servers
 */
plan.target('local', {});
plan.target('production', cfg.production, cfg.production.opts);
plan.target('production-db', cfg.productionDB, cfg.productionDB.opts);

/**
 * Setup folders, prompts etc. ready for install
 */
let sshUser, sshPort, sshHost, webRoot, dbName, dbUser, dbPw;
let date = `${new Date().getTime()}`;

plan.local(['start', 'assets-pull', 'db-pull', 'db-replace'], local => {
  sshHost = plan.runtime.hosts[0].host;
  sshUser = plan.runtime.hosts[0].username;
  sshPort = plan.runtime.hosts[0].port;
  webRoot = plan.runtime.options.webRoot;
  dbName = plan.runtime.options.dbName;
  dbUser = plan.runtime.options.dbUser;
  dbPw = plan.runtime.options.dbPw;
});


/* ======
 * Start & update
 * ====== */

plan.local(['start'], local => {
  local.log('Installing dependencies...');
  local.exec(`
    docker-compose up -d

    docker run --rm -v ${process.env.DEVELOPMENT_SSH_KEYS_PATH}:/root/.ssh \
      --volumes-from={{name}}-web \
      --workdir=/var/www/html/ composer/composer clearcache

    docker run --rm -v ${process.env.DEVELOPMENT_SSH_KEYS_PATH}:/root/.ssh \
    --volumes-from={{name}}-web \
    --workdir=/var/www/html/ composer/composer update
  `);
});


/* ======
 * Pull assets
 * ====== */

plan.local(['assets-pull'], local => {
  local.log('Downloading uploads folder...');
  local.exec(`rsync -avz -e "ssh -p ${sshPort}" \
    ${sshUser}@${sshHost}:${webRoot}uploads web`, { failsafe: true });
});


/* ======
 * Backup database
 * ====== */

plan.local(['db-backup'], local => {
  local.log('Creating local backups...');
  local.exec(`mkdir -p database/local`, { silent: true, failsafe: true });
  local.exec(`docker-compose exec db bash -c "mysqldump -uroot -proot \
    typo3 > /database/local/typo3-${date}.sql"`);
});


/* ======
 * Pull database
 * ====== */

plan.remote(['db-pull'], remote => {
  remote.log('Creating remote database dump...');
  remote.exec(`mkdir -p ${webRoot}tmp/database/remote`, { silent: true, failsafe: true });
  remote.exec(`mysqldump -u${dbUser} -p${dbPw} ${dbName} > ${webRoot}tmp/database/remote/${dbName}-${date}.sql`);
});

plan.local(['db-pull'], local => {
  local.log('Pulling database...');
  local.exec(`mkdir -p database/remote`, { silent: true, failsafe: true });
  local.exec(`rsync -avz -e "ssh -p ${sshPort}" \
    ${sshUser}@${sshHost}:${webRoot}tmp/database/remote/${dbName}-${date}.sql ./database/remote`);
  local.exec(`cp ./database/remote/${dbName}-${date}.sql ./database/typo3.sql`);
});

plan.remote(['db-pull'], remote => {
  remote.log('Removing remote database dump...');
  remote.exec(`rm ${webRoot}tmp/database/remote/${dbName}-${date}.sql`);
});


/* ======
 * Replace database
 * ====== */

plan.local(['db-replace'], local => {
  local.log('Replacing database...')
  local.exec(String.raw`
    if [ -f "database/typo3.sql" ]
      then
        docker-compose exec db bash -c "mysql -uroot \
          -proot \
          -e 'drop database typo3; \
              create database typo3; \
              use typo3; source typo3.sql;'"
    fi
  `);
});
