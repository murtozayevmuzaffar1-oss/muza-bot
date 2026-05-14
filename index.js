const TelegramBot = require('node-telegram-bot-api');

const token = '8936164670:AAGQtuF1YakLLbzPguIOSe_cMGxVfL49B10';
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
          { text: '🌐 Portfolio', url: LINKS.portfolio },
          { text: '☁️ Weather Uzb', url: LINKS.weather }
        ],
        [
          { text: '💼 Xizmatlar', callback_data: 'services' },
          { text: '🚀 Samarkand Inside', callback_data: 'startup' }
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

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  users.add(chatId);

  bot.sendMessage(chatId, `👋 Salom, ${msg.from.first_name}

Men Muzaffarning rasmiy xizmat botiman.

Bu yerda siz:
• web sayt
• Telegram bot
• mobile ilova
• portfolio va aloqa ma’lumotlari

bo‘yicha ma’lumot olishingiz mumkin.

Quyidagilardan birini tanlang 👇`, menu());
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  await bot.answerCallbackQuery(query.id);

  if (data === 'menu') {
    return bot.sendMessage(chatId, 'Asosiy menyu 👇', menu());
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

Hozirda:
🚀 Samarkand Inside startupi
🏠 Ijara ilovasi
🌦 Weather Uzb mobile ilovasi

ustida ishlamoqdaman.

Maqsadim:
zamonaviy va foydali digital loyihalar yaratish 🚀`, backMenu());
  }

  if (data === 'services') {
    return bot.sendMessage(chatId, `💼 Xizmatlar

🌐 Web sayt
• Portfolio sayt
• Landing page
• Biznes sayt

🤖 Telegram bot
• Buyurtma bot
• Menyu bot
• Aloqa bot

📱 Mobile ilova
• Flutter ilova
• Android app
• Weather app

Asosiy maqsad:
zamonaviy, tez ishlaydigan va responsive loyiha yaratish.`, backMenu());
  }

  if (data === 'startup') {
    return bot.sendMessage(chatId, `🚀 Samarkand Inside

Samarqand turizmi uchun yaratilayotgan startup loyiha.

Loyihada:
• 360° virtual tour
• audio guide
• tarixiy joylar
• turist navigator
• smart yo‘nalishlar

Maqsad:
Samarqand tarixini zamonaviy digital experience sifatida ko‘rsatish.`, backMenu());
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