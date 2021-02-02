const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const startMessage =
  "Давай сыграем в игру... Для начала укажи мне два числа через запятую:\n";

const getQuestionAnswer = (message) => {
  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      const numbers = answer
        .split(",")
        .map((el) => Math.ceil(Number(el.trim())))
        .sort();
      const notNumber = numbers.some((el) => Number.isNaN(el));
      if (notNumber) {
        return getQuestionAnswer(
          "Сорри, с нечисловыми значениями я не играю, попробуй еще раз...\n"
        );
      } else {
        resolve(numbers);
      }
    });
  });
};

const playGame = async () => {
  const [firstNumber, secondNumber] = await getQuestionAnswer(startMessage);
  const someValue = Math.ceil(
    Math.random() * (secondNumber - firstNumber) + firstNumber
  );
  console.log(
    `Хе-хе. Загадал число между ${firstNumber} и ${secondNumber}. Попробуй угадай...`
  );

  rl.on("line", (answer) => {
    const numAnswer = Number(answer);
    if (numAnswer < someValue) console.log("Маловато будет");
    if (numAnswer > someValue) console.log("Многовато будет");
    if (numAnswer === someValue) {
      console.log(`Ох уж эти сказочники, отгадал ${someValue}!`);
      rl.close();
    }
  });
};

playGame();
