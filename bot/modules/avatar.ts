import { ChatInputCommandInteraction, EmbedBuilder } from "npm:discord.js";
import { Command } from "../commands.ts";

export default class avatarCommand implements Command {
  data = {
    id: "avatar",
    aliases: [],
    description: "Zeige den Avatar vom User",
    args: [
      {
        name: "user",
        description: "Useravatar",
        type: 6,
        required: true,
      },
    ],
  };

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user");
    if (!user) {
      return;
    }
    const reply = new EmbedBuilder()
      .setTitle(`Avatar von ${user.username}`)
      .setImage(user.displayAvatarURL({ size: 4096 }));

    await interaction.reply({ embeds: [reply], ephemeral: true });
  }
}
