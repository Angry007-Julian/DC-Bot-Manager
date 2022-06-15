import { ChatInputCommandInteraction } from "npm:discord.js";
import { Command } from "../commands.ts";

export default class test implements Command {
  data = { id: "test", aliases: [], description: "testdesc", args: [] };
  // deno-lint-ignore require-await
  async execute(interaction: ChatInputCommandInteraction) {
    interaction.reply("test");
  }
}
