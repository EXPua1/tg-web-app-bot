const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// replace the value below with the Telegram token you receive from @BotFather
const token = '7190231619:AAHLdtgH1EFrLsbKlboRUwZ4vppUOGAtyb0';

// Create a bot that uses 'polling' to fetch new updates
const webAppUrl = 'https://storied-entremet-88d966.netlify.app'
const bot = new TelegramBot(token, {polling: true});
const app = express();


app.use(morgan('combined'));
app.use(express.json());
app.use(cors())


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;


    if(text === '/start') {
        await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму', web_app: {url: webAppUrl + '/form'}}]
                ]
            }
        })
        await bot.sendMessage(chatId, 'Заходи в наш интернет магазин по кнопке ниже', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Сделать заказ', web_app: {url: webAppUrl }}]
                ]
            }
        })
    }
    if (msg && msg.web_app_data && msg.web_app_data.data) {
        // Если в сообщении прилетело вебеппдата и поле data не пустое
        try {
            const data = JSON.parse(msg.web_app_data.data); // принимаем данные
            console.log(data);

            if (data && data.country && data.street) {
                await bot.sendMessage(chatId, 'Спасибо за обратную связь!');
                await bot.sendMessage(chatId, 'Ваша страна: ' + data.country);
                await bot.sendMessage(chatId, 'Улица: ' + data.street);

                setTimeout(async () => {
                    await bot.sendMessage(chatId, 'Вся информация будет отправлена в этот чат.');
                }, 3000);
            } else {
                console.log('Некорректные данные:', data);
            }
        } catch (e) {
            console.log('Ошибка при разборе JSON:', e);
        }
    }
    })

app.post('/web-data', async (req, res) => {
    const { queryId, products, totalPrice } = req.body;
    console.log('Received POST request with data:', req.body); // Добавлен отладочный вывод
    try {
        // Отправляем ответ об успешной покупке в Telegram
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: { message_text: 'Поздравляю с покупкой, вы приобрели товар на сумму ' + totalPrice }
        });
        // Отправляем статус 200 в качестве ответа
        return res.status(200).json({});
    } catch (e) {
        // Если произошла ошибка, отправляем ответ о неудачной покупке в Telegram
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Не удалось приобрести товар',
            input_message_content: { message_text: 'Не удалось приобрести товар' }
        });
        // Отправляем статус 500 в качестве ответа
        return res.status(500).json({});
    }
});





const PORT = 8001;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))
