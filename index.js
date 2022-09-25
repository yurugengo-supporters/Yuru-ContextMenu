//Manage Messages 
require('dotenv').config();
const { Client, GatewayIntentBits, Partials   } = require('discord.js');
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });
const commands=[
	{
		name:"Delete this bot message",
		name_localizations:{"ja":"BOTの結果を削除"},
		type:ApplicationCommandType.Message,
	},
];
async function _set_command(guild) {
	console.log("コマンドを登録しました:" + guild.id + "(" + guild.name + ")" );
	await client.application.commands.set(commands, guild.id);
}

client.once('ready', async () => {
	for (let guild of client.guilds.cache.values()) {
		await _set_command(guild);
	}
	console.log('ready');
});

async function _contextmenu_delete_bot_message(interaction) {
	const message = interaction.options.getMessage("message");
	try {
		//console.dir(message);
		if (message.author.bot) {
			//console.dir(interaction.user);
			if (message.interaction.user.id == interaction.user.id) {
				message.delete();
				await interaction.reply(
					{
						content:"BOTの結果を削除しました",
						flags:64,
					}
				);
				return;
			}
		}
	} catch (error) {
		console.dir(interaction.user);
		console.dir(message);
		console.log(error);
	}
	await interaction.reply(
		{
			content:"このメッセージは削除できません",
			flags:64,
		}
	);
}

client.on('interactionCreate', async interaction => { 
	if (interaction.isContextMenuCommand()) {
		const { commandName } = interaction;
		if (commandName == commands[0].name) {
			await _contextmenu_delete_bot_message(interaction);
		}
	}
});

client.on("guildCreate", async guild=>{
	await _set_command(guild);
});

client.login(process.env.DISCORD_TOKEN);
