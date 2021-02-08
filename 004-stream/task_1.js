#!/usr/bin/env node
const fsExtra = require("fs-extra");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { FOLDER_NAME, EXIT_MSG } = require("./constants");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const startMessage = `Давай сыграем в игру... в любой момент ты можешь нажать ${EXIT_MSG} и выйти из игры.
Для начала дай мне название файла, куда я буду записывать результаты:\n`;

const getQuestionAnswer = (message) => {
  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      if (!answer)
        return getQuestionAnswer("Друг, мне все же нужно название файла!");
      const extension = answer.includes(".") ? "" : ".log";
      const fileName = answer + extension;
      resolve(fileName);
    });
  });
};

const playGame = async () => {
  const fileName = await getQuestionAnswer(startMessage);
  const folderPath = path.join(__dirname, FOLDER_NAME);
  const fullName = path.join(folderPath, fileName);
  const exists = await fsExtra.pathExists(fullName);

  if (exists) {
    console.log("Извини, но такой файл уже существует.");
    process.exit(1);
  }
  console.log(`Ща поиграем! Логи будут лежать тут: ${fullName}`);

  const heheMsg = "Хе-хе. Я буду загадывать 1 или 2. Попробуй угадай...";
  await fsExtra.ensureDir(folderPath);
  const ws = fs.createWriteStream(fullName);
  ws.on("finish", () =>
    console.log("Спасибо за игру! Записал все результаты.")
  );

  console.log(heheMsg);
  rl.on("line", (answer) => {
    const someValue = Math.floor(Math.random() * 2) + 1;
    const numAnswer = Number(answer);
    if (numAnswer) {
      const correctAnswer = numAnswer === someValue;
      const msg = correctAnswer ? "Угадал, молодец!" : "Кек, не угадал";
      console.log(msg);
      ws.write(`${correctAnswer}\n`);
    } else {
      if (answer.toLowerCase() === EXIT_MSG) {
        ws.end();
        rl.close();
      } else {
        console.log("Чото непонятное ты мне написал :(");
      }
    }
  });
};

playGame();
