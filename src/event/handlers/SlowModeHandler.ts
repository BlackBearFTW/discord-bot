import {Constants, Message, MessageEmbed} from "discord.js";
import {SLOW_MODE, EMBED_COLOURS} from "../../config.json";
import EventHandler from "../../abstracts/EventHandler";
import DateUtils from "../../utils/DateUtils";

class SlowModeHandler extends EventHandler {
	constructor() {
		super(Constants.Events.MESSAGE_CREATE);
	}

	async handle(message: Message): Promise<void> {
		if (message.author.bot) return;

		if (!(message.channel.id in SLOW_MODE)) return;

		const messages = await message.channel.messages.fetch();

		const lastMessage = messages.filter(m => m.author.id === message.author.id).first(2)[1];

		// @ts-ignore
		const minimalTime = lastMessage.createdTimestamp + SLOW_MODE[message.channel.id];

		if (message.createdTimestamp > minimalTime) return;

		const embed = new MessageEmbed();
		const timeDifference = DateUtils.getFormattedTimeSinceDate(new Date(message.createdTimestamp), new Date(minimalTime));

		await message.delete();

		embed.setTitle("Cooldown Active");
		embed.setDescription(`${message.author.username} You still need to wait \`${timeDifference}\` before you can send a new message`);
		embed.setColor(EMBED_COLOURS.ERROR);
		const sendMessage = await message.channel.send(embed);

		setTimeout(() => {
			sendMessage.delete();
		}, 10000);
	}
}

export default SlowModeHandler;