#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argumentsObject = yargs(hideBin(process.argv)).argv;

const ARG_CURRENT = "current";
const ARG_ADD = "add";
const ARG_DECREASE = "sub";

const [baseCommand] = argumentsObject._;
const yearArg = argumentsObject.y || argumentsObject.year;
const monthArg = argumentsObject.m || argumentsObject.month;
const dateArg = argumentsObject.d || argumentsObject.date;
const today = new Date();

const toSet = (base, arg) =>
  baseCommand === ARG_ADD ? base + arg : base - arg;

if (baseCommand === ARG_CURRENT) {
  if (yearArg) return console.log(today.getFullYear());
  if (monthArg) return console.log(today.getMonth() + 1);
  if (dateArg) return console.log(today.getDate());
  return console.log(today.toISOString());
}

if (baseCommand === ARG_ADD || baseCommand === ARG_DECREASE) {
  let milliseconds = 0;
  if (dateArg) {
    const date = today.getDate();
    const daysToSet = toSet(date, dateArg);
    milliseconds = today.setDate(daysToSet);
  }
  if (yearArg) {
    const year = today.getFullYear();
    const yearsToSet = toSet(year, yearArg);
    milliseconds = today.setFullYear(yearsToSet);
  }
  if (monthArg) {
    const month = today.getMonth();
    const monthToSet = toSet(month, monthArg);
    milliseconds = today.setMonth(monthToSet);
  }

  console.log(new Date(milliseconds).toISOString());
  return;
}
