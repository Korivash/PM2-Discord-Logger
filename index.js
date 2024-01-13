const { Client, Intents, MessageEmbed } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const pm2 = require('pm2');
const winston = require('winston');
require('dotenv').config();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

const TOKEN = process.env.BOT_TOKEN;
const logChannelId = '1195485972503220234'; // Enter Channel ID here to send logs to.

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(TOKEN);

const lastReadPositions = {};

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level} - ${message}`;
    })
  ),
});

async function sendDetailedLogToDiscord(log, processName, logType) {
  const embed = new MessageEmbed()
    .setColor(logType === 'Error' ? '#FF0000' : '#0099ff')
    .setTitle(`Log from ${processName} (${logType})`)
    .setDescription('```yaml\n' + log + '\n```');

  try {
    await client.channels.cache.get(logChannelId).send({ embeds: [embed] });
  } catch (error) {
    console.error('Error sending detailed log to Discord:', error);
  }
}

function sendNewLogEntries(logFilePath, processName) {
  let filePosition = lastReadPositions[logFilePath] || 0; 

  const readStream = fs.createReadStream(logFilePath, {
    encoding: 'utf8',
    start: filePosition,
  });

  readStream.on('data', (chunk) => {
    filePosition += chunk.length;
    lastReadPositions[logFilePath] = filePosition;
    const lines = chunk.split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        if (line.includes('ERROR')) {
          sendDetailedLogToDiscord(line, processName, 'Error');
        } else if (line.includes('INFO')) {
          sendDetailedLogToDiscord(line, processName, 'Info');
        }
      }
    });
  });

  readStream.on('error', (error) => {
    console.error('Error reading log file:', error);
  });

  readStream.on('end', () => {
    fs.watchFile(logFilePath, { encoding: 'utf8', interval: 1000 }, () => {
      sendNewLogEntries(logFilePath, processName);
    });
  });
}

function sendPM2LogsToDiscord(pm2Process) {
  const logFilePath = pm2Process.pm2_env.pm_out_log_path;
  const processName = pm2Process.name; 

  sendNewLogEntries(logFilePath, processName);
}

pm2.connect((error) => {
  if (error) {
    console.error('PM2 connection error:', error);
    return;
  }

  pm2.list((listError, processes) => {
    if (listError) {
      console.error('PM2 list error:', listError);
      pm2.disconnect();
      return;
    }

    processes.forEach((pm2Process) => {
      sendPM2LogsToDiscord(pm2Process);
    });
  });
});

client.on('error', console.error);













