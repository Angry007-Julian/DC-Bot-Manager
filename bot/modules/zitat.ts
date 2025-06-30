import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} from "npm:discord.js";
import { zitatChannel } from "../channel.ts";
import { Command } from "../commands.ts";
import { noperms, zitatAdded } from "../embed.ts";
import { teamRoles } from "../roles.ts";

export default class zitatCommand implements Command {
  data = {
    id: "zitat",
    aliases: ["zitat"],
    description: "Zitat hinzufügen",
    args: [
      {
        name: "user",
        description: "Wen möchtest du zitieren?",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "zitat",
        description: "Was möchtest du zitieren?",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  };

  async execute(interaction: ChatInputCommandInteraction) {
    if (
      !interaction.member || !("roles" in interaction.member) ||
      !interaction.member.roles.cache.some((role) =>
        teamRoles.includes(role.id)
      )
    ) {
      await interaction.reply({ embeds: [noperms], ephemeral: true });
      return;
    }

    const user = interaction.options.getUser("user");
    const zitat = interaction.options.getString("zitat");
    const interactionMember = interaction.user;

    if (!user || !zitat) {
      await interaction.reply({
        content: "Ungültige Eingabe.",
        ephemeral: true,
      });
      return;
    }

    const guild = interaction.guild;
    const channel = await guild?.channels.fetch(zitatChannel);

    if (!channel) {
      await interaction.reply({
        content: "Channel nicht gefunden.",
        ephemeral: true,
      });
      return;
    }

    if (channel.isTextBased()) {
      await channel.send({
        embeds: [zitatAdded(user, interactionMember, zitat)],
      });
      await interaction.reply({
        content: "Zitat hinzugefügt.",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "Channel ist kein Textkanal.",
        ephemeral: true,
      });
    }
  }
}
