# scrum-bot

![Build Status](https://travis-ci.org/judkoffi/scrum-bot.svg?branch=master)

- Run mongodn with docker
```
mkdir ~/scrum-bot-data
docker run -d -p 27017:27017 -v ~/scrum-bot-data:/data/db mongo
```