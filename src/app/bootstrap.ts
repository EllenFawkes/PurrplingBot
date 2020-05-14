import PurrplingBot from "@purrplingbot/core/PurrplingBot"
import MetricsProvider from "@purrplingbot/providers/MetricsProvider"
import botContainer from "@purrplingbot/app/ioc"
import Auditor from "@purrplingbot/services/Auditor";
import Database from "@purrplingbot/services/Database";
import { Commander } from "@purrplingbot/core/Commander";
import types from "@purrplingbot/types";
import CommandProvider from "@purrplingbot/core/CommandProvider";

export default async function run() {
  console.info(`PurrplingBot version __BOT_VERSION__ '__BOT_CODENAME__'`);
  
  // Initialize commands
  botContainer.get<Commander>(Commander.TYPE).registerProviders(
    ...botContainer.getAll<CommandProvider>(types.CommandProvider)
  );

  botContainer.get<MetricsProvider>(MetricsProvider.TYPE).serve(); // Serve metrics via HTTP
  botContainer.get<Auditor>(Auditor.TYPE).init(); // Initialize auditor
  
  // Last run the bot
  await botContainer.get<PurrplingBot>(PurrplingBot.TYPE).run();
}