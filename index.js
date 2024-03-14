const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

// replace the value below with the Telegram token you receive from @BotFather
const token = '7190231619:AAHLdtgH1EFrLsbKlboRUwZ4vppUOGAtyb0';

// Create a bot that uses 'polling' to fetch new updates
const webAppUrl = 'https://storied-entremet-88d966.netlify.app';
const bot = new TelegramBot(token, {polling: true});
const app = express();

// Добавляем middleware для обработки JSON-запросов и CORS
app.use(express.json());
app.use(cors());

// Обработчик сообщений от бота Telegram
bot.on('message', async (msg) => {
    // Извлекаем chatId и текст сообщения
    const chatId = msg.chat.id;
    const text = msg.text;

    // Логика обработки сообщений, например, отправка сообщений пользователю
    // ...

    // Логика обработки пришедших данных от веб-приложения
    // ...

});

// Обработчик POST-запросов от веб-приложения
app.post('/web-data', async (req, res) => {
    // Извлекаем данные из тела запроса
    const { queryId, products, totalPrice } = req.body;
    try {
        // Отправляем ответ на запрос через бота Telegram
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: { message_text: 'Поздравляю с покупкой, вы приобрели товар на сумму ' + totalPrice }
        });
        // Отправляем успешный ответ клиенту
        return res.status(200).json({});
    } catch (e) {
        // Обработка ошибок и отправка ответа клиенту в случае ошибки
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Не удалось приобрести товар',
            input_message_content: { message_text: 'Не удалось приобрести товар' }
        });
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Запускаем сервер на указанном порту
const PORT = 8000;
app.listen(PORT, () => console.log('Server started on PORT ' + PORT));
