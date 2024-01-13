# PM2 Logger for Discord

# Description
The PM2 Logger is a Discord bot designed to capture and send PM2 logs to a specified Discord channel. It's ideal for monitoring your PM2-managed applications directly from Discord. The bot reads log files, identifies new log entries, and sends them to a Discord channel in an embed format, making it easier for developers and system administrators to keep an eye on their applications' health and performance.

# Features
Real-time Logging: Sends log updates in real-time as they occur in your PM2 processes.
Embed Messages: Formats log messages in Discord embeds for better readability.
Error and Info Log Separation: Differentiates between error and info logs for more precise monitoring.
Easy to Configure: Simple setup process tailored for those with basic knowledge of Node.js and Discord bot creation.

# Prerequisites
Before you start using the PM2 Logger, ensure you have the following:
Node.js (version 16 or higher).
A Discord account and permissions to create a bot.
PM2 installed on your system to manage your Node.js applications.
Installation
Clone the Repository

``git clone https://github.com/your-repository/pm2-logger.git 
cd pm2-logger``

Install Dependencies

``npm install``

Setting Up Discord Bot

Go to the Discord Developer Portal.
Create a new application and set up a bot user.
Copy the bot token, you will need it for the .env file.
Configure Environment Variables

Create a .env file in the root directory of the project.
Add the following lines, replacing YOUR_BOT_TOKEN and YOUR_LOG_CHANNEL_ID with your actual bot token and Discord log channel ID.
makefile

``BOT_TOKEN=YOUR_BOT_TOKEN
LOG_CHANNEL_ID=YOUR_LOG_CHANNEL_ID``

# Run the Bot

``npm start index.js``

# Usage
After starting the bot, it will automatically connect to your PM2 processes and begin monitoring their logs. When new logs are generated, the bot will send updates to your designated Discord channel in an embed format. The bot separates error logs and informational logs for efficient monitoring.

Ensure that the bot has the necessary permissions to read messages and send messages in the specified Discord channel.

# Customization
You can customize the bot further by editing its source code. For example, you can modify the embed message appearance, set up filters for specific types of logs, or add additional Discord commands for more interactive control.

# Contributing
Contributions to the PM2 Logger are welcome. Please feel free to fork the repository, make your changes, and create a pull request.

License
This project is licensed under the MIT License - see the LICENSE file for details.