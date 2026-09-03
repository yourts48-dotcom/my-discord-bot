const { Client, GatewayIntentBits, PermissionFlagsBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const spamState = new Map();

const ALLOWED_USERS = ['1495954990362001488'];

client.once('ready', () => {
    console.log(`[+] Bot is online! Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const channelId = message.channel.id;

    if (message.content.startsWith('سبام ')) {
        const isAdmin = message.member.permissions.has(PermissionFlagsBits.Administrator);
        const isAllowedUser = ALLOWED_USERS.includes(message.author.id);

        if (!isAdmin && !isAllowedUser) {
            return message.reply('❌ للأسف، الأمر هذا للأدمن أو الأشخاص المسموح لهم فقط!');
        }

              const args = message.content.slice(5).trim().split(/ +/);
        const speedInput = parseFloat(args[0]);

        let delayInSeconds = 1;        
        
        let textToSpam = '';

        if (!isNaN(speedInput) && speedInput > 0) {
            delayInSeconds = speedInput;
            textToSpam = args.slice(1).join(' ');
        } else {
            textToSpam = args.join(' ');
        }

        if (!textToSpam) {
            return message.reply('اكتب الرسالة اللي تبي تديرلها سبام!');
        }

        if (spamState.get(channelId)) {
            return message.reply('السبام شغال بالفعل في الروم هادي!');
        }

        const delayMs = Math.max(delayInSeconds * 1000, 200);

        spamState.set(channelId, true);
        message.reply(`بدأ السبام كل **${delayMs / 1000}** ثانية: "${textToSpam}" 🚀`);

        while (spamState.get(channelId)) {
            await message.channel.send(textToSpam).catch(() => {
                spamState.set(channelId, false);
            });
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }

    if (message.content.trim() === 'وقف' || message.content.trim() === 'واقف') {
        const isAdmin = message.member.permissions.has(PermissionFlagsBits.Administrator);
        const isAllowedUser = ALLOWED_USERS.includes(message.author.id);

        if (!isAdmin && !isAllowedUser) {
            return message.reply('❌ ما عندكش صلاحية لإيقاف السبام!');
        }

        if (spamState.get(channelId)) {
            spamState.set(channelId, false);
            message.reply('تم إيقاف السبام بنجاح! 🛑');
        } else {
            message.reply('ما فيش سبام شغال توا عشان نوقفه!');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
