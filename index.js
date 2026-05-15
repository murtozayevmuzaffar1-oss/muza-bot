const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();

app.get('/', (req, res) => {
  res.send('Muza bot ishlayapti 🚀');
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
        [
          { text: '✅ Bajargan loyihalarim', callback_data: 'projects' }
        ],
        [
          { text: '📝 Buyurtma berish', callback_data: 'order' }
        ],
        [
          { text: '👨‍💻 Dasturchi haqida', callback_data: 'about' }
        ],
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

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  users.add(chatId);

  await bot.sendMessage(chatId, '♻️ Menu yangilanmoqda...', {
    reply_markup: {
      remove_keyboard: true
    }
  });

  await bot.sendPhoto(
    chatId,
    'photo_2026-05-15_21-32-38.jpg',
    {
      caption: `🚀 Muzaffar Developer

• Web saytlar
• Telegram botlar
• Mobile ilovalar
• AI texnologiyalar

Zamonaviy va sifatli digital loyihalar yarataman 🔥

Quyidagilardan birini tanlang 👇`,
      ...menu()
    }
  );
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  await bot.answerCallbackQuery(query.id);

  if (data === 'menu') {
    return bot.sendPhoto(
      chatId,
      'photo_2026-05-15_21-32-38.jpg',
      {
        caption: `🚀 Asosiy menyu`,
        ...menu()
      }
    );
  }

  if (data === 'projects') {
    return bot.sendMessage(chatId, `✅ Bajargan loyihalarim

🌐 Portfolio:
${LINKS.portfolio}

☁️ Weather Web:
${LINKS.weather}

📱 Weather APK:
Flutter asosida yaratilgan ob-havo ilovasi.

🚀 Samarkand Inside
🏠 Ijara App

startup loyihalari ustida ishlamoqdaman.`, backMenu());
  }

  if (data === 'about') {
    return bot.sendPhoto(
      chatId,
      'photo_2026-05-15_21-31-44.jpg',
      {
        caption: `👨‍💻 Dasturchi haqida

Salom! Mening ismim Muzaffar Murtazoyev.

Men:
• Web Developer
• Bot Developer
• Mobile Developer
• AI Enthusiast

yo‘nalishlarida faoliyat yuritaman.

Hozirda:
🚀 Samarkand Inside
🏠 Ijara App
🌦 Weather Uzb

loyihalari ustida ishlamoqdaman.`,
        ...backMenu()
      }
    );
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

👤 Ism:
${order.name}

📞 Telefon:
${order.phone}

💼 Xizmat:
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

👥 Foydalanuvchilar:
${users.size} ta`);
  }

  bot.sendMessage(chatId, '👇 Menyudan birini tanlang', menu());
});

console.log('Premium bot ishlayapti 🚀');