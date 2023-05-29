const express = require('express');
const app = express();

const chats = require('./chats');
const users = require('./users');

module.exports = [chats, users];
