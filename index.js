const { Client, GatewayIntentBits } = require('discord.js');

// إنشاء العميل مع الصلاحيات (Intents) المطلوبة
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// حادثة التشغيل: تظهر في الـ Console عند نجاح الاتصال
client.once('ready', () => {
    console.log(`[+] Bot is online! Logged in as ${client.user.tag}`);
});

// حادثة استقبال الرسائل
client.on('messageCreate', (message) => {
    // تجاهل الرسائل القادمة من البوتات الأخرى
    if (message.author.bot) return;

    // الرد على كلمة ping
    if (message.content.toLowerCase() === 'ping') {
        message.reply('Pong! 🏓');
    }
});

// تسجيل الدخول باستخدام التوكين الممرر عبر متغيرات البيئة
client.login(process.env.DISCORD_TOKEN);
