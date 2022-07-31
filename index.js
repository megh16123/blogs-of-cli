#!/usr/bin/env node

import chalk from "chalk";
import * as fs from "fs";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";

const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));
var flowflag = true;

const content = fs.readFileSync("./content.json", "utf-8");
const contentData = JSON.parse(content);

const spinn = async (secs = 2000) => {
  const spinner = createSpinner("Loading...").start();
  await sleep(secs);
  spinner.success({ text: "Success" });
};

const welcome = async () => {
  const welcomeMessage = chalkAnimation.rainbow(
    `Welcome to the chort cli blog`
  );
  await sleep();
  welcomeMessage.stop();
};
const inputEmail = async () => {
  const email = await inquirer.prompt({
    name: "emailin",
    type: "input",
    message: "What is your email address?",
  });
  return email.emailin;
};
const usermanage = async () => {
  const readerEmail = await inputEmail();
  await spinn(1000);
  let userData = fs.readFileSync("./user.json", "utf-8");
  userData = JSON.parse(userData);
  let flag = false;
  await userData.forEach((element) => {
    if (element.email === readerEmail) {
      flag = true;
    }
  });
  if (flag) {
    console.log(chalk.green(`Welcome back ${readerEmail}`));
  } else {
    const user = { email: readerEmail };
    await userData.push(user);
    fs.writeFileSync("./user.json", JSON.stringify(userData));
    console.log(chalk.green(`User Created`));
  }
};
const showTopics = async () => {
  const topics = contentData.map((element) => {
    return element.slug;
  });
  console.log(chalk.green(`Available Topics`));
  const topicChoice = await inquirer.prompt({
    type: "list",
    name: "topic",
    choices: topics,
  });
  return topicChoice.topic;
};
const getArticles = async () => {
  const selectedTopic = await showTopics();
  await spinn(1000);
  const articles = await contentData.filter((element) => {
    return element.slug === selectedTopic;
  });
  return articles;
};
const getTitles = async () => {
  const articles = await getArticles();

  const titles = articles.map((element) => {
    return element.Title;
  });
  console.log(chalk.green(`Available Articles`));

  const title = await inquirer.prompt({
    type: "list",
    name: "titlein",
    choices: titles,
  });

  return articles.filter((elem) => elem.Title === title.titlein)[0];
};
const getArticle = async () => {
  const article = await getTitles();
  await spinn(3000);
  figlet(article.Title, function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(chalk.red(data));

    console.log(`  ${chalk(article.Description)}
    ${chalk.yellow(article.paragraph)}`);
  });
};
await welcome();
await usermanage();
while (flowflag) {
  await getArticle();
  const asker = await inquirer.prompt({
    type: "confirm",
    name: "asker1",
    default: true,
    message: "Do you want to read another article?",
  });
  if (!asker.asker1) {
    flowflag = false;
  }
}
figlet("Bye Bye", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(gradient.pastel.multiline(data));
});
