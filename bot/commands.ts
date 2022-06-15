import { ChatInputCommandInteraction, Interaction } from "npm:discord.js";

export interface Command {
  data: {
    id: string;
    aliases: string[];
    description: string;
    args: {
      name: string;
      description: string;
      type: number;
      required: boolean;
    }[];
  };
  execute: (message: ChatInputCommandInteraction) => void;
}

const commands = new Map<string, Command>();

export async function loadCommands() {
  for (const command of Deno.readDirSync("./bot/modules")) {
    const commandModule =
      (new (await import(`./modules/${command.name}`)).default()) as Command;
    commands.set(commandModule.data.id, commandModule);
  }
  return Array.from(
    commands.entries().map(([key, value]) => {
      return {
        name: key,
        description: value.data.description,
        options: value.data.args,
      };
    }),
  );
}

export function runCommand(interaction: Interaction) {
  if (interaction.isChatInputCommand()) {
    const command = commands.get(interaction.commandName);
    if (command) {
      command.execute(interaction);
    }
  }
}
