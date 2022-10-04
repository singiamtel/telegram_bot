# My personal assistant, in Telegram Bot form

This bot implements some miscellaneous features that I use regularly. So far they are:

- [X] Send a picture from your phone, and receive an Imgur link to easily share it

# How to deploy

So far it's not containerized, so the deployment is very manual

```bash
git clone https://github.com/singiamtel/tele_bot
cat > .env << EOF
TELEGRAM_TOKEN='<your_telegram_token>'
IMGUR_TOKEN='<your_imgur_token>'
EOF
npm install
npm start
```

# License

The project is MIT, feel free to use it for any purpose you see fit. I gladly accept pull requests
