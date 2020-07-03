import { Constants, MessageEmbed, Message } from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import { ALLOWED_FILE_EXTENSIONS } from "../../config.json";

class CodeblocksOverFileUploadsHandler extends EventHandler {
	constructor() {
		super(Constants.Events.MESSAGE_CREATE);
	}

	async handle(message: Message): Promise<void> {
		let invalidFileFlag = false;

		if (message.attachments.size > 0) {
			message.attachments.forEach(attachment => {
				if (!ALLOWED_FILE_EXTENSIONS.includes(attachment.name?.split(".").pop()!)) {
					invalidFileFlag = true;
				}
			});

			if (invalidFileFlag) {
				const embed = new MessageEmbed();

				embed.setTitle("Uploading Files");
				embed.setDescription(`<@${message.author.id}> Please use codeblocks over attachments when sending code.`);
				embed.setFooter("Type ?codeblock for more information.");

				await message.channel.send({ embed });
				if (message.deletable) {
					message.delete();
				}
			}
		}
	}
}

export default CodeblocksOverFileUploadsHandler;