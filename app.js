'use strict';

process.title = 'app';
module.exports = init;

require('./common/logger.js');

const async = require('async');
const _ = require('underscore');
const express = require('express');
const path = require('path');
const glob = require('glob');
const Sequelize = require('sequelize');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const redis = require('redis');
const cors = require('cors');

global.util = require('util');
global.config = {};

process.on('uncaughtException',
  function (err) {
    logErrorAndExit('uncaughtException thrown:', err);
  }
);

function init() {
  let bag = {
    app: global.app,
    env: process.env,
    config: {
      dbName: 'contact-app',
      dbHost: 'localhost',
      dbDialect: 'postgres',
      dbPassword: '',
      dbUsername: 'himanshu',
      appPort: 50000
    }
  };

  bag.who = util.format('app|%s', init.name);

  async.series([
      createExpressApp.bind(null, bag),
      //initializeDatabaseConfig.bind(null, bag),
      initializeSequelize.bind(null, bag),
      initializeRedis.bind(null, bag),
      initializeRoutes.bind(null, bag),
      startListening.bind(null, bag),
      setLogLevel.bind(null, bag),
    ],
    function (err) {
      if (err) {
        logger.error('Could not initialize api app: ' +
          util.inspect(err));
      } else {
        logger.info(bag.who, 'Completed');
        global.app = bag.app;
        module.exports = global.app;
      }
    }
  );
}

function createExpressApp(bag, next) {
  let who = bag.who + '|' + createExpressApp.name;
  try {
    let app = express();
    app.use(bodyParser.json({limit: '10mb'}));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    // CORS
    const externalWhiteList = [/127.0.0.1*/];
    const CORS_CONFIG = {
      origin: false,
      methods: ['GET', 'POST'],
      optionsSuccessStatus: 200
    };
    app.use(cors(CORS_CONFIG));
    // Views config
    app.use(express.static(path.join(__dirname, '/public')));
    app.set('view engine', 'ejs');
    app.set('views', [path.join(__dirname, '/public'),
      path.join(__dirname, '/public/static')
    ]);

    bag.app = app;
    return next();
  } catch (err) {
    logErrorAndExit('Uncaught Exception thrown from createExpressApp.', err);
  }
}

function initializeDatabaseConfig(bag, next) {
  let who = bag.who + '|' + initializeDatabaseConfig.name;
  logger.debug(who, 'Inside');

  let configErrors = [];

  if (bag.env.DBNAME)
    bag.config.dbName = bag.env.DBNAME;
  else
    configErrors.push('DBNAME is not defined');

  if (bag.env.DBUSERNAME)
    bag.config.dbUsername = bag.env.DBUSERNAME;
  else
    configErrors.push('DBUSERNAME is not defined');

  if (bag.env.DBPASSWORD)
    bag.config.dbPassword = bag.env.DBPASSWORD;
  else
    configErrors.push('DBPASSWORD is not defined');

  if (bag.env.DBHOST)
    bag.config.dbHost = bag.env.DBHOST;
  else
    configErrors.push('DBHOST is not defined');

  if (bag.env.DBPORT)
    bag.config.dbPort = bag.env.DBPORT;
  else
    configErrors.push('DBPORT is not defined');

  if (bag.env.DBDIALECT)
    bag.config.dbDialect = bag.env.DBDIALECT;
  else
    configErrors.push('DBDIALECT is not defined');

  if (bag.env.REDISHOST)
    bag.config.redisHost = bag.env.REDISHOST;
  else
    configErrors.push('REDISHOST is not defined');

  if (configErrors.length)
    next(configErrors);
  else next();
}

function initializeSequelize(bag, next) {
  let who = bag.who + '|' + initializeSequelize.name;
  logger.debug(who, 'Inside');

  let sequelizeOptions = {
    host: bag.config.dbHost,
    dialect: bag.config.dbDialect,
  };

  let sequelize = new Sequelize(
    bag.config.dbName,
    bag.config.dbUsername,
    bag.config.dbPassword,
    sequelizeOptions);

  global.sequelize = sequelize;

  // Initialize all the models
  glob.sync('./models/*.js').forEach(
    function (schemaPath) {
      logger.debug(who, 'Initializing schema file', schemaPath);
      require(schemaPath);
    }
  );

  sequelize.sync().asCallback(
    function (err) {
      if (err)
        return next('Failed to sync sequelize with err:' + err);

      logger.debug('SEQUELIZE: Synced successfully');
      return next();
    }
  );
}

function initializeRedis(bag, next) {
  let who = bag.who + '|' + initializeRedis.name;
  logger.debug(who, 'Inside');

  let opts = {
    port: 6379,
    host: bag.config.redisHost || '127.0.0.1'
  };
  global.redis = redis.createClient(opts);
  global.redis.on('error', function (err) {
    return next(err);
  });

  global.redis.on('connect', function () {
    return next();
  });
}

function initializeRoutes(bag, next) {
  let who = bag.who + '|' + initializeRoutes.name;
  logger.debug(who, 'Inside');

  let router = require('./api/router.js');
  router.route(bag.app);

  return next();
}

function startListening(bag, next) {
  let who = bag.who + '|' + startListening.name;
  logger.debug(who, 'Inside');

  let appPort = bag.config.appPort;

  bag.app.listen(appPort, '0.0.0.0',
    function (err) {
      if (err)
        return next(err);
      logger.info('App listening on %s.', appPort);
      logger.info('Visit.', appPort);
      return next();
    }
  );
}

function setLogLevel(bag, next) {
  let who = bag.who + '|' + setLogLevel.name;
  logger.debug(who, 'Inside');

  let loggerConfig = {};
  //loggerConfig.runMode = 'production';

  logger.debug('Setting log level as ' + loggerConfig.runMode);
  logger.configLevel(loggerConfig);

  return next();
}

function logErrorAndExit(message, err) {
  logger.error(message);

  if (err && err.message)
    logger.error(err.message);

  if (err && err.stack)
    logger.error(err.stack);

  setTimeout(
    function () {
      process.exit(1);
    },
    3000
  );
}

if (require.main === module)
  init();

