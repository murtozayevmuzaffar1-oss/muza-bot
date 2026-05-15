const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();

app.get('/', (req, res) => {
  res.send('Muza bot ishlayapti');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server ishlayapti');
});

const token = process.env.TOKEN;
const ADMIN_ID = 7536089106;

const bot = new TelegramBot(token, { polling: true });

const orders = {};
const users = new Set();

const LINKS = {
  portfolio: 'https://murtozayevmuzaffar1-oss.github.io/my-portfolio/',
  weather: 'https://murtozayevmuzaffar1-oss.github.io/uz-weather/ob-havo.html',
  telegram: 'https://t.me/muzaffar_uz01',
  instagram: 'https://instagram.com/mr_muzaffar23',
  phone: '+998930623323'
};

function menu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '✅ Bajargan loyihalarim', callback_data: 'projects' }],
        [{ text: '📝 Buyurtma berish', callback_data: 'order' }],
        [{ text: '👨‍💻 Dasturchi haqida', callback_data: 'about' }],
        [
          { text: '📞 Aloqa', callback_data: 'contact' },
          { text: '❓ FAQ', callback_data: 'faq' }
        ]
      ]
    }
  };
}

function backMenu() {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '⬅️ Asosiy menyu', callback_data: 'menu' }]
      ]
    }
  };
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  users.add(chatId);

  bot.sendMessage(chatId, `👋 Salom, ${msg.from.first_name}

Men Muzaffarning rasmiy xizmat botiman.

Bu yerda siz:
• bajarilgan loyihalarimni ko‘rishingiz
• web sayt, bot yoki mobile ilova buyurtma qilishingiz
• dasturchi haqida ma’lumot olishingiz
• aloqa ma’lumotlarini ko‘rishingiz mumkin.

Quyidagilardan birini tanlang 👇`, menu());
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  await bot.answerCallbackQuery(query.id);

  if (data === 'menu') {
    return bot.sendMessage(chatId, 'Asosiy menyu 👇', menu());
  }

  if (data === 'projects') {
    return bot.sendMessage(chatId, `✅ Bajargan loyihalarim

🌐 Portfolio:
${LINKS.portfolio}

☁️ Weather Web:
${LINKS.weather}

📱 Weather App:
Weather Uzb APK tayyor va ishlaydi.

Hozirda:
🚀 Samarkand Inside startupi
🏠 Ijara ilovasi

ustida ishlamoqdaman.`, backMenu());
  }

  if (data === 'about') {
    return bot.sendMessage(chatId, `👨‍💻 Dasturchi haqida

Salom! Mening ismim Muzaffar Murtazoyev.

Men ISFT institutining “Axborot tizimlari va texnologiyalari” yo‘nalishi bo‘yicha talabasiman hamda School 21 da mobil dasturlash (Android va iOS) yo‘nalishida tahsil olaman.

Asosiy yo‘nalishlarim:
• Web development
• Telegram bot yaratish
• Mobile ilovalar
• AI texnologiyalari

Maqsadim:
zamonaviy va foydali digital loyihalar yaratish 🚀`, backMenu());
  }

  if (data === 'contact') {
    return bot.sendMessage(chatId, `📞 Aloqa

Telegram:
${LINKS.telegram}

Instagram:
${LINKS.instagram}

Telefon:
${LINKS.phone}`, backMenu());
  }

  if (data === 'faq') {
    return bot.sendMessage(chatId, `❓ FAQ

Savol: Sayt telefon uchun mos bo‘ladimi?
Javob: Ha, responsive dizayn qilinadi.

Savol: Telegram bot ham qilasizmi?
Javob: Ha.

Savol: Mobile ilova ham yaratasizmi?
Javob: Ha, Flutter ilovalar ustida ishlayman.

Savol: Web saytga Telegram ulash mumkinmi?
Javob: Ha.`, backMenu());
  }

  if (data === 'order') {
    orders[chatId] = { step: 'name' };
    return bot.sendMessage(chatId, `📝 Buyurtma berish

Ismingizni yozing:`);
  }
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith('/start')) return;

  if (orders[chatId]?.step === 'name') {
    orders[chatId].name = text;
    orders[chatId].step = 'phone';
    return bot.sendMessage(chatId, `📞 Telefon raqamingizni yozing:

Masalan:
+998901234567`);
  }

  if (orders[chatId]?.step === 'phone') {
    orders[chatId].phone = text;
    orders[chatId].step = 'service';
    return bot.sendMessage(chatId, `💼 Qaysi xizmat kerak?

Masalan:
• Web sayt
• Telegram bot
• Mobile ilova`);
  }

  if (orders[chatId]?.step === 'service') {
    orders[chatId].service = text;
    orders[chatId].username = msg.from.username || 'username yo‘q';

    const order = orders[chatId];

    await bot.sendMessage(chatId, `✅ Buyurtmangiz qabul qilindi!

Ism:
${order.name}

Telefon:
${order.phone}

Xizmat:
${order.service}

Tez orada siz bilan bog‘lanamiz 🚀`, menu());

    await bot.sendMessage(ADMIN_ID, `🔥 Yangi buyurtma

👤 Ism:
${order.name}

📞 Telefon:
${order.phone}

💼 Xizmat:
${order.service}

📲 Telegram:
@${order.username}

🆔 Chat ID:
${chatId}`);

    delete orders[chatId];
    return;
  }

  if (text === '/stat') {
    if (chatId !== ADMIN_ID) return;
    return bot.sendMessage(chatId, `📊 Statistika

Foydalanuvchilar:
${users.size} ta`);
  }

  bot.sendMessage(chatId, 'Menyudan birini tanlang 👇', menu());
});

console.log('Premium bot ishlayapti...');