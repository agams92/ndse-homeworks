#!/usr/bin/env node
require("dotenv").config();
const http = require("http");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const startMessage = `Привет! Дай мне название города, для которого посмотрим текущую погоду (можно как на русском, так и на английском):\n`;

const getQuestionAnswer = (message) => {
  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      if (!answer)
        return getQuestionAnswer("Друг, мне все же нужно название города!\n");
      resolve(answer.trim());
    });
  });
};

const getWeather = async () => {
  const city = await getQuestionAnswer(startMessage);
  const URL = `http://api.weatherstack.com/current?access_key=${process.env.API_KEY}&query=${city}`;
  await http.get(URL, (res) => {
    const statusCode = res.statusCode;
    if (statusCode !== 200) {
      console.error(`Status Code: ${statusCode}`);
      return;
    }
    res.setEncoding("utf8");
    let rawData = "";
    res.on("data", (chunk) => (rawData += chunk));
    res.on("end", () => {
      let parsedData = JSON.parse(rawData);
      if (parsedData.error) {
        console.log("Что-то пошло не так :(");
        console.log(parsedData);
      } else {
        console.log(`Текущая погода для ${city}`);
        console.log(parsedData.current);
      }
      process.exit(0);
    });
  });
};

getWeather();
