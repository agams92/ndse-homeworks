#!/usr/bin/env node
const fsExtra = require("fs-extra");
const fsPromises = require("fs/promises");
const path = require("path");
const readline = require("readline");
const { FOLDER_NAME } = require("./constants");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const startMessage = `Скажи мне плес название файла с логами, поищу в ${FOLDER_NAME}\n`;

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

const analizeResult = async () => {
  const fileName = await getQuestionAnswer(startMessage);
  rl.close();
  const folderPath = path.join(__dirname, FOLDER_NAME);
  const fullName = path.join(folderPath, fileName);
  const exists = await fsExtra.pathExists(fullName);

  if (!exists) {
    console.log("Извини, но такого файла нет :(");
    process.exit(1);
  }

  const rawData = await fsPromises.readFile(fullName, "utf-8");
  const parsedData = rawData.split("\n").filter((el) => el);
  const totalAmount = parsedData.length;
  const correctAnswersAmount = parsedData.filter((el) => el === "true").length;
  const wrongAnswersAmount = parsedData.filter((el) => el === "false").length;
  const percent = (correctAnswersAmount / totalAmount) * 100;
  const allMsg = `
Всего проведено партий: ${totalAmount};
Из них:
Выигранных - ${correctAnswersAmount};
Проигранных - ${wrongAnswersAmount};
Процентное соотношение выигранных партий: ${percent};
`;
  console.log(allMsg);
};

analizeResult();
