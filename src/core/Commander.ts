import { Message } from "discord.js";

export interface Command {
  name: string;
  description?: string;
  aliases?: string[];
  usage?: string;
  subcommands?: Command[];
  execute(message: Message, args?: string[]): void;
}

export class Commander {
  private readonly registry: Command[] = [];
  public readonly prefix: string = "!";

  constructor(prefix?: string) {
    if (prefix) {
      this.prefix = prefix;
    }
  }

  getCommands(): Command[] {
    return Array.from(this.registry);
  }

  fetch(commandName: string): Command | null {
    return this.registry.find(
      (command) => command.name === commandName || command.aliases?.includes(commandName)
    ) || null;
  }

  register(command: Command): void {
    this.registry.push(command);
  }
}