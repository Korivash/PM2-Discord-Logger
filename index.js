const { Client, Intents, MessageEmbed } = require('discord.js');
const fs = require('fs');
const pm2 = require('pm2');
require('dotenv').config();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

const TOKEN = process.env.BOT_TOKEN;
const logChannelId = ''; // Enter Channel ID here to send logs to.

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  startSendingLogs();
});

client.login(TOKEN);

const sentLogEntries = new Set(); // 
let lastPosition = 0; // 

function sendDetailedLogToDiscord(log, processName, logType) {
  const embed = new MessageEmbed()
    .setColor(logType === 'Error' ? '#FF0000' : '#0099ff')
    .setTitle(`Log from ${processName} (${logType})`)
    .setDescription('```yaml\n' + log + '\n```');
  try {
    client.channels.cache.get(logChannelId).send({ embeds: [embed] });
  } catch (error) {
    console.error('Error sending detailed log to Discord:', error);
  }
}
function sendNewLogEntries(logFilePath, processName) {
  const readStream = fs.createReadStream(logFilePath, {
    encoding: 'utf8',
    start: lastPosition, 
  });
  readStream.on('data', (chunk) => {
    const lines = chunk.split('\n');
    lines.forEach((line) => {
      if (line.trim() && !sentLogEntries.has(line)) {
        if (line.includes('ERROR')) {
          sendDetailedLogToDiscord(line, processName, 'Error');
        } else if (line.includes('INFO')) {
          sendDetailedLogToDiscord(line, processName, 'Info');
        }
        sentLogEntries.add(line); 
      }
    });
  });
  readStream.on('end', () => {
    lastPosition = fs.statSync(logFilePath).size;
  });

  readStream.on('error', (error) => {
    console.error('Error reading log file:', error);
  });
}
function sendPM2LogsToDiscord(pm2Process) {
  const logFilePath = pm2Process.pm2_env.pm_out_log_path;
  const processName = pm2Process.name;

  sendNewLogEntries(logFilePath, processName);
}

function startSendingLogs() {
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
}

client.on('error', console.error);













