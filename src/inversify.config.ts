import "reflect-metadata";
import { Container, interfaces } from "inversify";
import PurrplingBot from "@purrplingbot/core/PurrplingBot";
import { Client } from "discord.js";
import { Commander } from "@purrplingbot/core/Commander";
import Auditor from "@purrplingbot/services/Auditor";
import MetricsProvider from "@purrplingbot/providers/MetricsProvider";
import TextCommandProvider from "@purrplingbot/providers/TextCommandProvider";
import types from "@purrplingbot/types";
import { createCommandsContainer } from "@purrplingbot/commands";
import CoreCommandProvider from "@purrplingbot/providers/CoreCommandProvider";
import Database from "@purrplingbot/services/Database";

const botContainer = new Container({defaultScope: "Singleton"});

botContainer.bind<string>(types.Token).toConstantValue(process.env.TOKEN!);
botContainer.bind<string>(types.Prefix).toConstantValue(process.env.PREFIX || "!");
botContainer.bind<string>(types.AuditChannelId).toConstantValue(process.env.AUDIT_CHANNEL!);
botContainer.bind<string>(types.CatWomanId).toConstantValue(process.env.CATWOMAN_ID!);

// Commander
botContainer.bind<Commander>(Commander.TYPE)
  .to(Commander);

// PurrplingBot core
botContainer.bind<PurrplingBot>(PurrplingBot.TYPE)
  .to(PurrplingBot);

// Discord client
botContainer.bind<Client>(types.DiscordClient)
  .toConstantValue(new Client());

// Database
botContainer.bind<Database>(Database).toSelf();

// Auditor
botContainer.bind<Auditor>(Auditor.TYPE)
  .to(Auditor);

// Metrics
botContainer.bind<MetricsProvider>(MetricsProvider.TYPE)
  .to(MetricsProvider);

// Command providers
botContainer.bind<CoreCommandProvider>(types.CommandProvider).to(CoreCommandProvider);
botContainer.bind<TextCommandProvider>(types.CommandProvider).to(TextCommandProvider);

// Create commands
botContainer.load(createCommandsContainer());

export default botContainer;
