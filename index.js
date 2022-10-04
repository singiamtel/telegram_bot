const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const { ImgurClient } = require('imgur');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('db.sqlite');
db.run('CREATE TABLE IF NOT EXISTS images (telegramURL TEXT, imgurURL TEXT)');

const token = process.env.TELEGRAM_TOKEN;
const imgurClient = new ImgurClient({ accessToken: process.env.IMGUR_TOKEN });

const bot = new TelegramBot(token, {polling: true});
console.log("Ready");

bot.onText(/\/cdn (.+)/, async (msg, match) => {
	// 'msg' is the received Message from Telegram
	// 'match' is the result of executing the regexp above on the text content of the message

	bot.sendMessage(chatId, resp);
});

bot.onText(/ping/, (msg) => {
	// Debug
	bot.sendMessage(msg.chat.id, "pong");
});

const photoUrl = 'https://api.telegram.org/file/bot' + token + '/'
bot.on('photo', async (msg) => {
	// Get image
	const chatId = msg.chat.id;
	if(!msg.photo) {
		console.log("No data");
		return
	}
	const id = msg.photo[msg.photo.length - 1].file_id
	try{

		const img = await bot.getFile(id);
		const downloadURL = photoUrl + img.file_path;
		db.get('SELECT imgurURL FROM images WHERE telegramURL = ?', downloadURL, async (err, row) => {
			if(err) {
				console.log(err);
				return;
			}
			if(row) {
				console.log(row);
				bot.sendMessage(chatId, row.imgurURL);
				return;
			}
			else{
				const res = await imgurClient.upload({
					image: downloadURL,
					type: 'url'
				});
				db.run('INSERT INTO images VALUES (?, ?)', downloadURL, res.data.link);
				bot.sendMessage(chatId, res.data.link);
			}
		})

	} catch (e) {
		console.log(e);
		bot.sendMessage(chatId, "Internal error");
	}
	});
