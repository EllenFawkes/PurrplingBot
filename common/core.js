const EventEmmiter = require('events');
const LOGGER = require("../lib/logger.js");
const UTILS = require("../lib/utils.js");
const Commander = require("./commander");
const Discord = require('discord.js');
const moment = require('moment');
const DEBUG = process.env.DEBUG || 0;

var logger = LOGGER.createLogger("Core");

class Core extends EventEmmiter {
  constructor(config, store) {
    super();

    this._client = new Discord.Client();
    this._config = config;
    this._store  = store;

    this._checkConf(); // Check configuration

    this._commander = new Commander(this, this._config.cmdPrefix);
    this._pluginRegistry = null;

    this._client.on('ready', this._onReady);
    this._client.on('message', this._onMessage);
    this._client.on('messageUpdate', this._onMessageUpdate);
    this._client.on('disconnect', this._onDisconnect);
    this._client.on('debug', this._onDebug);
    this._client.on('warn', this._onWarn);
    this._client.on('reconecting', this._onReconecting);
  }

  run() {
    let config = this._config;

    // Restore aliases
    this._commander.aliases = this._store.restoreScope("aliases");

    // Load plugin registry and init plugins
    this._pluginRegistry = require("./pluginRegistry.js");
    this._pluginRegistry.init();

    // Autosave enabled? Set interval for save storage
    const STORAGE_CONF = config.storage;
    if (STORAGE_CONF.autosave || true) {
      const INTERVAL = STORAGE_CONF.autosaveInterval || 90; // Interval in seconds
      this._client.setInterval(function (core) {
        if (DEBUG > 1) logger.log("Triggered store autosave interval!");
        core.Store.flush();
      }, INTERVAL * 1000, this);
      logger.info("Store autosave started! Interval: %ss", INTERVAL);
    }

    // Print a stats to log
    logger.info("* Registered commands: %s", Object.keys(this._commander.cmds).length);
    logger.info("* Loaded plugins: %s", this._pluginRegistry.countPlugins());
    logger.info("* Disabled plugins: %s", this._pluginRegistry.countDisabledPlugins());

    // Connect bot to Discord!
    logger.info("*** Trying to connect Discord");
    this._client.login(config.discord.token);
  }

  logEvent(msg, type = "Bot", level = "INFO") {
    const eventLoggerConf = this._config.eventLogger || {};
    const enabled = eventLoggerConf.enabled || false;
    const channelID = eventLoggerConf.loggingChannelID;
    if (!enabled) {
      logger.log("Can't send log event - EventLogger is DISABLED!");
      return;
    }
    if (!channelID) {
      logger.error("Can't send log event - loggingChannelID is EMPTY!");
      return;
    }
    var channel = this._client.channels.find('id', channelID);
    if (!channel) {
      logger.log("Can't send log event - Unknown event logging channel: %s", channelID);
      return;
    }
    if (level == "DEBUG" && DEBUG < 1) return;
    let timestamp = moment(new Date()).format("MM/DD HH:mm:ss");
    channel.send(`${timestamp}: _${level}_ - **${type}** - ${msg}`)
    .then(logger.info(`Event log ${type} - "${msg}" sent to #${channel.name} level: ${level}`))
    .catch(logger.error);
  }

  createLogger(scope) {
    return LOGGER.createLogger(scope);
  }

  _checkConf() {
    let config = this._config;
    if (!config.discord) {
      logger.error("Discord scope not defined in config!");
      process.exit(6);
    }
    if (!config.discord.token) {
      logger.error("Token not defined in discord scope!");
      process.exit(6);
    }
    logger.log("Configuration check is OK!");
  }

  _onReady() {
    logger.dir(event);
    logger.info(`Logged in as ${this._client.user.username} - ${this._client.user.id} on ${this._client.guilds.array().length} servers`);
    stats.numberOfReconnection++;
    eventBus.emit("ready");
    log_event("PurrplingBot is ready and works!", "BotReady");
    logger.info("PurrplingBot READY!");
  }

  _onMessage(message) {
    var isCmd = commander.check_message_for_command(message); //check and handle cmd
    eventBus.emit("message", message, isCmd);
  }

  _onMessageUpdate(oldMessage, newMessage) {
    var isCmd = commander.check_message_for_command(newMessage); //check and handle cmd
    eventBus.emit("messageUpdate", oldMessage, newMessage, isCmd);
  }

  _onDisconnect(event) {
    logger.warn("PurrplingBot disconnected from Discord service!")
    logger.warn("Reason: #%s - %s", event.code, event.reason);
    logger.info("*** Exiting");
    process.exit(15);
  }

  _onDebug(info){
    if (DEBUG > 1) logger.log(info);
  }

  _onWarn(info){
    logger.warn(info);
  }

  _onReconecting() {
    logger.warn("Connection lost! Trying to reconnect ...");
  }

  get Store() {
    return this._store;
  }

  get Configuration() {
    return this._config;
  }

  getPluginRegistry() {
    return this._pluginRegistry;
  }

  getCommandRegistry() {
    return commander.cmds;
  }

  getDiscordClient() {
    return this._client;
  }

  getStats() {
    return stats;
  }

  /*
   * @deprecated
   */
  getAliases() {
    return this._commander.aliases;
  }

  /*
   * @deprecated
   */
  addCommand(cmdName, cmdObject) {
    this._commander.addCommand(cmdName, cmdObject);
  }

  /*
   * @deprecated
   */
  addAlias(aliasName, command) {
    this._commander.addAlias(aliasName, command);
  }

  /*
   * @deprecated
   */
  getConfiguration(){
    return this._config;
  }

  /*
   * @deprecated
   */
  getStore() {
    return this._store;
  }
}

var stats = {
  commandsHandled: 0,
  numberOfReconnection: 0
}

module.exports = Core;

if (require.main === module) {
  console.log("To start PurrplingBot please run purrplingbot.js instead.");
}
