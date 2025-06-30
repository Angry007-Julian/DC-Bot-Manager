// deno-lint-ignore-file no-explicit-any
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ModalBuilder,
  TextChannel,
  TextInputBuilder,
  TextInputStyle,
} from "npm:discord.js";
import { Command } from "../commands.ts";
import { getServerPicture } from "../helperfunction.ts";
import { admin } from "../roles.ts";
import { nopermsEmbed } from "../standards/standard_embed.ts";

export default class sendEmbed implements Command {
  data = {
    id: "embed",
    aliases: [],
    description: "Sende ein Embed in einen Channel",
    args: [
      {
        name: "channel",
        description: "Channel in den das Embed gesendet werden soll",
        type: ApplicationCommandOptionType.Channel,
        required: true,
      },
    ],
  };

  async execute(interaction: ChatInputCommandInteraction) {
    const channel = interaction.options.getChannel("channel") as TextChannel;

    if (
      !interaction.member || !("cache" in interaction.member.roles) ||
      !interaction.member.roles.cache.some((role) => admin.includes(role.id))
    ) {
      interaction.reply({
        embeds: [nopermsEmbed(interaction.client, interaction.user.id)],
      });
      return;
    }

    if (!channel) {
      interaction.reply({
        content: "Bitte wähle einen gültigen Text-Channel aus.",
        ephemeral: true,
      });
      return;
    }

    const modal = new ModalBuilder()
      .setCustomId("embedModal")
      .setTitle("Create Embed");

    const titleInput = new TextInputBuilder()
      .setCustomId("embedTitle")
      .setLabel("Title")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const descriptionInput = new TextInputBuilder()
      .setCustomId("embedDescription")
      .setLabel("Description")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const customColorInput = new TextInputBuilder()
      .setCustomId("embedCustomColor")
      .setLabel("Custom Hex Color (e.g., #123456)")
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const firstActionRow = new ActionRowBuilder<TextInputBuilder>()
      .addComponents(titleInput);
    const secondActionRow = new ActionRowBuilder<TextInputBuilder>()
      .addComponents(descriptionInput);
    const thirdActionRow = new ActionRowBuilder<TextInputBuilder>()
      .addComponents(customColorInput);

    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

    await interaction.showModal(modal);

    const filter = (i: any) =>
      i.customId === "embedModal" && i.user.id === interaction.user.id;

    interaction
      .awaitModalSubmit({ filter, time: 60000 })
      .then(async (modalInteraction: any) => {
        const title = modalInteraction.fields.getTextInputValue("embedTitle");
        const description = modalInteraction.fields.getTextInputValue(
          "embedDescription",
        );
        const customColor = modalInteraction.fields.getTextInputValue(
          "embedCustomColor",
        );

        let color = 0x00ff00;
        if (customColor && /^#[0-9A-Fa-f]{6}$/.test(customColor)) {
          color = parseInt(customColor.replace("#", ""), 16);
        }

        const embed = new EmbedBuilder()
          .setColor(color)
          .setTitle(title)
          .setThumbnail(
            getServerPicture(interaction.client, interaction.guildId!),
          )
          .setDescription(description);

        await channel.send({ embeds: [embed] });

        await modalInteraction.reply({
          content: `Embed in <#${channel.id}> gesendet!`,
          ephemeral: true,
        });
      })
      .catch(console.error);
  }
}
