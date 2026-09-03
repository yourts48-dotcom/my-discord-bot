const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const spamState = new Map();

client.once('ready', () => {
    console.log(`[+] Bot is online! Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const channelId = message.channel.id;

    if (message.content.startsWith('سبام ')) {
        const textToSpam = message.content.slice(5).trim();

        if (!textToSpam) {
            return message.reply('اكتب الرسالة اللي تبي تديرلها سبام بعد كلمة سبام!');
        }

        if (spamState.get(channelId)) {
            return message.reply('السبام شغال بالفعّال في الروم هادي!');
        }

        spamState.set(channelId, true);
        message.reply(`بدأ السبام: "${textToSpam}" 🚀 (اكتب "وقف" للإيقاف)`);

        while (spamState.get(channelId)) {
            await message.channel.send(textToSpam).catch(() => {
                spamState.set(channelId, false);
            });
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    if (message.content.trim() === 'وقف' || message.content.trim() === 'واقف') {
        if (spamState.get(channelId)) {
            spamState.set(channelId, false);
            message.reply('تم إيقاف السبام بنجاح! 🛑');
        } else {
            message.reply('ما فيش سبام شغال توا عشان نوقفه!');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
