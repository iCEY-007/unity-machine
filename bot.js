Promise = require('bluebird');

childProcess = require('child_process');
const redis = require('@redis/client')
Discord = require('discord.js');
fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
fs = Promise.promisifyAll(require('fs'));
const {google} = require('googleapis');
const { redis } = require('googleapis/build/src/apis/redis');
const isImage = require('is-image');
he = require('he');
isImage = require('is-image');
moment = require('moment');
mongo = Promise.promisifyAll(require('mongodb'));
path = require('path');
Papa = require('papaparse');
schedule = require('node-schedule');
const striptags = require('striptags');
const xml2js = require('xml2js');
ytdl = require('ytdl-core');

const botPrefix = "!";
const version = "2.3.0"; // Version
PROD_GUILD = "256222023993393152";
require('dotenv').config()

numRequests = 0;
schedule.scheduleJob('*/30 * * * * *', () => numRequests = 0);

// Send message stating there are too many API requests
tooManyRequests = msg => {
	let numSeconds = new Date().getSeconds();
	numSeconds = (Math.ceil(numSeconds / 30) * 30) - numSeconds;
	msg.channel.send(`Error: Too many API requests. Please wait ${numSeconds} ${numSeconds === 1 ? "second" : "seconds"} before trying again.`); // "second" if waiting 1 second, else "seconds"
}

rpsDeleteJobs = new Map(); // Map containing jobs to auto-delete RPS messages

MongoClient = mongo.MongoClient;
const mongoURI = process.env.MONGODB_URI;
const mongoUser = process.env.MONGODB_USER;

pronouns = [];
// Initialise MongoDB
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
	if (err) console.error(`Could not connect to MongoDB: ${err}`);
	dbo = db.db(mongoUser);
	userCollections = dbo.collection("userNations"); // Collection for user-nation key-value pairs
	CICollections = dbo.collection("comradeIndex"); // Collection for info about the Comrade Index
	scheduledReminders = dbo.collection("scheduledReminders"); // Collection for Scheduled Reminders
	counter = dbo.collection("counter"); // Collection for counting number of Fs, good bot and bad bot
	(async () => pronouns = (await dbo.collection("pronouns").findOne({"id": "pronouns"})).pronouns)(); // Array of all available pronouns
	//(async () => nonWAElectoralCitizens = (await dbo.collection("nonWAElectoralCitizens").findOne({"id": "nonWAElectoralCitizens"})).nonWAElectoralCitizens)(); // Array of all non-WA Electoral Citizens of TLA
});

// Initialise Redis
async () => {
	const redisClient = redis.createClient();
	await redisClient.connect();
	redisClient.on('error', err => console.error(`Could not connect to Redis: ${err}`))
}

// Initialise Google API
youtube = google.youtube({
	version: 'v3',
	auth: process.env.YOUTUBE_AUTH
});

musicQueue = [] // Queue for playing music
dispatcher = null; // Transmits voice packets from stream

// Used to sign into PRAW
redditClientID = process.env.REDDIT_APP_ID;
redditClientSecret = process.env.REDDIT_APP_SECRET;

client = new Discord.Client({
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MEMBERS,
		Discord.Intents.FLAGS.GUILD_PRESENCES,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Discord.Intents.FLAGS.DIRECT_MESSAGES
	],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

// Get commands from folder
async function getCommands(normalisedPath) {
	let foundCommands = [];
	files = await fs.readdirAsync(normalisedPath);
	files.forEach(file => {
		foundCommands.push(require(path.join(normalisedPath, file)));
	});
	let commandCollection = new Discord.Collection();
	foundCommands.forEach(command => {
		if (command.aliases) { // If command has aliases
			let validNames = command.aliases;
			validNames.push(command.name);
			commandCollection.set(validNames, command);
		} else {
			commandCollection.set([command.name], command);
		}
	});
	return commandCollection;
}

// Run promises synchronously
const commandsPath = path.join(__dirname, "commands");
(async () => client.commands = await getCommands(commandsPath))();
const specialCommandsPath = path.join(__dirname, "specialCommands");
(async () => client.specialCommands = await getCommands(specialCommandsPath))();

// Return random object in array
getRandomObject = ary => {
	randomIndex = Math.floor(Math.random() * ary.length);
	return ary[randomIndex];
}

// Get certain number of messages in channel
getMessages = async (channel, number = Infinity) => { // Number of messages to get defaults to infinity
	let channelMessages = new Discord.Collection();
	let lastFetch = await channel.messages.fetch({limit: 100}); // Get last 100 messages
	channelMessages = channelMessages.concat(lastFetch);
	
	// There still are messages to get and need to fetch more messages
	while (lastFetch.size === 100 && channelMessages.size < number) {
		lastFetch = await channel.messages.fetch({limit: 100, before: lastFetch.lastKey()}); // Get next 100 messages
		channelMessages = channelMessages.concat(lastFetch);
	}

	while (channelMessages.size > number) { // More messages than requested
		channelMessages.delete(channelMessages.lastKey()); // Delete earliest message
	}
	return channelMessages;
}

// Send HTTP GET request
getRequest = (url, parseXML) => {
	return new Promise(async (resolve, reject) => {
		const options = {
			headers: {
				'User-Agent': `Unity Machine v${version}` // User Agent
			}
		};
		const res = await fetch(url, options); // Response message
		// Client or Server error
		if (! res.ok) reject(`${res.status} ${res.statusText}`); // Reject promise with HTTP status code
		const body = await res.text(); // Message body of response

		if (parseXML) { // Parse XML from body
			const parser = new xml2js.Parser({explicitArray: false, async: true});
			try {
				var content = await parser.parseStringPromise(body); // Parse XML in body
			} catch (err) {
				reject(err);
			}
		} else {
			var content = he.decode(striptags(body)); // Remove tags and convert HTML codes
			content = content.split('\n');
			content = content.filter(x => x != '');
		}
		resolve(content);
	});
}

// Get nation of sender
getNation = msg => {
	return userCollections.findOne({id: msg.author.id}).then(object => object.nation);
}

// Execute Python file
executePythonFile = async (pythonFile, args) => {
	return new Promise((resolve, reject) => {
		const pythonProcess = childProcess.spawn('python', [pythonFile].concat(args)); // Run Python File with arguments
		pythonProcess.stderr.on('data', data => reject(data.toString())); // If error occurred reject with error message
		pythonProcess.stdout.on('data', data => resolve(data.toString())); // If no error resolve with returned message
	});
}

// Write file and send it
writeAndSend = async (msg, filename, data) => {
	//stream = fs.createWriteStream(filename)
	//data.forEach(async content => await stream.write(content));

	await fs.writeFile(filename, data, err => { if (err) console.error(err); });
	await msg.channel.send({files: [filename]});
	fs.unlink(filename, err => {if (err) console.error(err);}); // console.error any error if any
}

// Read file and split by newline
openFile = async filename => {
	let fileContent = await fs.readFileAsync(path.join(__dirname, "data", filename), "utf-8"); // Open file
	fileContent = fileContent.split('\n');
	return fileContent;
}

(async () => {
	trophies = await openFile("trophies.txt");
	trophies[255] = "mostnations"; // Census no. 255 is Number of Nations
})();
(async () => {
	censusNames = await openFile("censusNames.txt");
	censusNames[255] = "Number of Nations";
})();
(async () => {
	censusDescriptions = await openFile("censusDescriptions.txt");
	censusDescriptions[255] = "The World Census tracked the movements of military-grade geo-airlifting helicopters to determine which regions have the most nations.";
})();

NSFavicon = "https://nationstates.net/favicon.ico";

const counterID = process.env.COUNTER_ID; // ID of counter
updateCounter = async () => {
	let rolesCount = {
		Verified: 0,
		Unverified: 0,
		CTE: 0,
		Assemblian: 0,
		Visitor: 0,
		"WA Citizen": 0,
		Online: 0,
		Offline: 0
	};
	pronouns.forEach(role => rolesCount[role] = 0);
	(await TLAServer.members.list({ limit: 1000 })).forEach(member => {
		for (var role in rolesCount) {
			if (member.roles.cache.find(r => r.name === role)) { // User has role
				rolesCount[role]++;
			}
		}
		if (member.presence && member.presence.status === "offline") {
			rolesCount.Offline++;
		} else {
			rolesCount.Online++;
		}
	});

	const discordEmbed = new Discord.MessageEmbed()
		.setColor('#ce0001')
		.setAuthor("\u{1f4ca}SERVER STATS \u{1f4ca}")
		.addField("Total members in server", TLAServer.memberCount.toString())

	for (var role in rolesCount) {
		discordEmbed.addField(role, rolesCount[role].toString(), true);
	}

	const counterMessage = await (await TLAServer.channels.fetch(IDS.channels.counter)).messages.fetch(counterID);

	counterMessage.edit({ embeds: [discordEmbed] }).catch(console.error);
}

// Reply to user
client.on('messageCreate', async msg => {
	// Do not respond to bot messages
	if (msg.author.bot) return;

	// Reply to special commands
	let specialCommandCheck = Array.from(client.specialCommands.keys()).find(command => command.includes(msg.content.toLowerCase()));
	if (specialCommandCheck) {
		client.specialCommands.get(specialCommandCheck).execute(msg);
		return;
	}

	// Adds ooc image to cache
	if (msg.channelId === IDS.channels.ooc && msg.attachments.size === 1 && isImage(msg.attachments[0].attachment)) {
		await redisClient.sAdd("messageIds", msg.id);
		await redisClient.hSet(msg.id, "ImageUrl", msg.attachments[0].attachment.url);
	}

	// Received message starts with bot prefix
	if (msg.content.startsWith(botPrefix)) {
		const fullCommand = msg.content.substr(botPrefix.length); // Remove the leading bot prefix
		const splitCommand = fullCommand.split(' '); // Split the message up in to pieces for each space
		const primaryCommand = splitCommand[0].toLowerCase(); // The first word directly after the exclamation is the command
		let args = splitCommand.slice(1); // All other words are args/parameters/options for the command
	
		nickname = (msg.channel.type === 'DM' ? msg.author.username : (await TLAServer.members.fetch(msg.author)).displayName); // Nickname of user, returns username if contacted via DM

		helpPrimaryCommand = `Please use \`!help ${primaryCommand}\` to show more information.`; // Directs user to use !help command in error

		let foundCommand = client.commands.get(Array.from(client.commands.keys()).find(command => command.includes(primaryCommand))); // Key in client.commands containing primaryCommand
		
		// If command does not exist
		if (! foundCommand) {
			msg.channel.send(`Error: \`!${primaryCommand}\` does not exist. Use \`!help\` to find all commands.`)
				.catch(() => msg.channel.send(`Error: That command does not exist. Use \`!help\` to find all commands.`));
			return;
		}
		try {
			await foundCommand.execute(msg, args);
		} catch (err) {
			msg.channel.send(`An unexpected error occurred: \`${err}\``);
		}
	}
});

// Message has been deleted
client.on('messageDelete', async (msg) => {
	// Checks if it is in cache
	if (await redisClient.sIsMember("messageIds", msg.id) === 1) {
		await redisClient.sRem("messageIds", msg.id)
		await redisClient.hDel(msg.id, "imageUrl")
	}
})

// Client is connected to Discord
client.once('ready', async () => {
	console.log("Connected as " + client.user.tag);  // Confirm connection
	client.user.setPresence({activity: {name: 'Type "!help" to get all commands'}});


	TLAServer = client.guilds.cache.first();
	IDS = (TLAServer.id === PROD_GUILD ? require('./ids.json') : require('./ids_test.json'));
	
	unverifiedRole = TLAServer.roles.cache.find(role => role.name === 'Unverified');

	// Update counter

	updateCounter();

	numRequests = 12; // 12 requests will be made

	// Reassign roles and kick CTEd/Unverifieds
	try {
		var nations = await getRequest("https://www.nationstates.net/cgi-bin/api.cgi?q=nations") // All nations in the world
	} catch (err) {
		console.error(`Unable to reach NationStates API. Error code: ${err}`);
		return;
	}
	nations = nations[0].split(',');

	const TLANationsLink = "https://www.nationstates.net/cgi-bin/api.cgi?region=the_leftist_assembly&q=nations"; // All TLA nations
	const WANationsLink = "https://www.nationstates.net/cgi-bin/api.cgi?wa=1&q=members"; // All WA Nations

	try {
		var TLANations = await getRequest(TLANationsLink); // All TLA Nations
	} catch (err) {
		console.error(`Unable to reach NationStates API. Error code: ${err}`);
		return;
	}

	try {
		var WANations = await getRequest(WANationsLink); // All WA Nations
	} catch (err) {
		console.error(`Unable to reach NationStates API. Error code: ${err}`);
		return;
	}

	TLANations = TLANations[0].split(':');
	WANations = WANations[0].split(',');

	const TLAWANations = TLANations.filter(nation => WANations.includes(nation)); // WA nations in TLA

	function isInTLA(rawNation) { // Check if nation is in TLA
		return TLANations.includes(rawNation);
	}

	/*function isElectoral(rawNation) { // Check if nation is an Electoral Citizen
		if (TLAWANations.includes(rawNation)) return true; // Nation is WA Nation in TLA
		if (nonWAElectoralCitizens.includes(rawNation)) return true; // Nation is non WA Electoral Citizen
		return false;
	}*/

	// Roles
	const verifiedRole = await TLAServer.roles.fetch(IDS.roles.verified);
	const assemblianRole = await TLAServer.roles.fetch(IDS.roles.assemblian);
	const visitorRole = await TLAServer.roles.fetch(IDS.roles.visitor);
	const CTERole = await TLAServer.roles.fetch(IDS.roles.CTE);

	// Iterate through all members. This will add them all to the cache as well.
	(await TLAServer.members.list({ limit: 1000 })).forEach(async member => {
		item = await userCollections.findOne({ id: member.id })
		if (! item) return; // member is bot
		const memberRoles = Array.from(member.roles.cache.values()); // Roles of member

		if (item.time) { // Unverified/CTEd
			if (moment().diff(moment(Number(item.time)), 'hours') >= 168) {
				member.kick("Sorry, you were unverified or marked as CTE for over 1 week.");
			}
			return;
		}

		try {
			const rawNation = item.nation.toLowerCase().replace(/ /g, '_');

			if ((! nations.some(nation => nation === rawNation)) && memberRoles.includes(verifiedRole)) { // User has CTEd but not marked as CTE yet
				const CTEMessage = eval(await fs.readFileAsync(path.join(__dirname, "data", "cteMessage.txt"), "utf-8")); // Add interpolation for text in cteMessage.txt
				member.send(CTEMessage);
	
				if (memberRoles.includes(assemblianRole)) { // User is marked as Assemblian
					member.roles.remove(assemblianRole);
				} else {
					member.roles.remove(visitorRole);
				}

				member.roles.remove(verifiedRole);
				member.roles.add(CTERole);

				userCollections.updateOne({id: member.id}, {'$set': {time: new Date().getTime(), nation: null}});

			} else if (memberRoles.includes(assemblianRole) && ! isInTLA(rawNation)) { // Is marked Assemblian but not in TLA
				member.roles.remove(assemblianRole);
				member.roles.add(visitorRole);

			} else if (isInTLA(rawNation) && memberRoles.includes(visitorRole)) { // Is marked Visitor but nation in TLA
				member.roles.remove(visitorRole);
				member.roles.add(assemblianRole);

			} else if (nations.some(nation => nation === rawNation) && memberRoles.includes(CTERole)) { // User is marked CTE but nation exists
				member.roles.remove(CTERole);
				member.roles.add(verifiedRole);
				member.roles.add(isInTLA(rawNation) ? assemblianRole : visitorRole); // If user is in TLA add Assemblian role else add Visitor role
			}

			/*if (isElectoral(rawNation) && ! memberRoles.includes(electoralCitizenRole)) { // User should be marked Electoral Citizen but is not 
				member.roles.add(electoralCitizenRole);
			} else if (! isElectoral(rawNation) && memberRoles.includes(electoralCitizenRole)) { // User is not Electoral Citizen but is marked as such
				member.roles.remove(electoralCitizenRole);
			}*/
		} catch (err) {
			console.error(`Error with nation ${item}: ${err}`)
		}
	});

	// Update statistics used for Comrade Index
	links = [
		"https://www.nationstates.net/cgi-bin/api.cgi?region=the_leftist_assembly&q=censusranks;scale=6",
		"https://www.nationstates.net/cgi-bin/api.cgi?region=the_leftist_assembly&q=censusranks;scale=7",
		"https://www.nationstates.net/cgi-bin/api.cgi?region=the_leftist_assembly&q=censusranks;scale=27",
		"https://www.nationstates.net/cgi-bin/api.cgi?region=the_leftist_assembly&q=censusranks;scale=28",
		"https://www.nationstates.net/cgi-bin/api.cgi?region=the_leftist_assembly&q=censusranks;scale=29",
		"https://www.nationstates.net/cgi-bin/api.cgi?region=the_leftist_assembly&q=censusranks;scale=57",
		"https://www.nationstates.net/cgi-bin/api.cgi?region=the_leftist_assembly&q=censusranks;scale=71",
		"https://www.nationstates.net/cgi-bin/api.cgi?region=the_leftist_assembly&q=censusranks;scale=73",
		"https://www.nationstates.net/cgi-bin/api.cgi?region=the_leftist_assembly&q=censusranks;scale=75"
	]
	maxTLA = []
	// Get top score of each census in TLA
	for (let i = 0; i < 9; i ++) {
		try {
			maxTLA.push(Number((await getRequest(links[i]))[2]));
		} catch (err) {
			console.error(`Unable to reach NationStates API. Error code: ${err}`);
			return;
		}
	}

	try {
		// Get number of nations in TLA
		var numNations = await getRequest("https://www.nationstates.net/cgi-bin/api.cgi?region=the_leftist_assembly&q=numnations");
	} catch (err) {	
		console.error(`Unable to reach NationStates API. Error code: ${err}`);
		return;
	}
	let place = Number(numNations[0]);
	do {
		const link = `https://www.nationstates.net/cgi-bin/api.cgi?region=the_leftist_assembly&q=censusranks;scale=51;start=${place}`;
		try {
			var corruption = await getRequest(link);
		} catch (err) {
			console.error(`Unable to reach NationStates API. Error code: ${err}`);
			return;
		}
		corruption = Number(corruption[2]);
		place --;
		numRequests ++;
	} while (Number.isNaN(corruption)) // If some nations do not have a corruption score in the API, then corruption = NaN

	corruption **= -0.5
	maxTLA.splice(5, 0, corruption); // Insert corruption into MaxTLA[5]

	CICollections.updateOne({id: "CI"}, {'$set': {"maxTLA": maxTLA}});

	const reminders = await scheduledReminders.find().toArray();
	reminders.forEach(async reminder => {
		const user = await client.users.fetch(reminder.id);
		const reminderDate = new Date(reminder.time);

		// Schedule reminder if reminder is due after current date and time
		if (reminderDate > new Date()) {
			schedule.scheduleJob(reminderDate, async () => {
				const object = await scheduledReminders.findOne(reminder);
				user.send(`Reminder: ${reminder.message}`);
				scheduledReminders.deleteOne(object);
			});

		// Send reminder if reminder is due before current date and time
		} else {
			user.send(`Reminder: ${reminder.message}`);
			scheduledReminders.deleteOne(reminder);
		}
	});

	// Delete text-only messages in #out-of-context
	const oocChannel = TLAServer.channels.cache.find(channel => channel.name === "out-of-context"); // Channel for OOC posts
	let oocMessages = await getMessages(oocChannel); // Get all messages in #out-of-context
	let oocMessages2 = oocMessages;
	// Filter out all mesages with one image
	oocMessages = oocMessages.filter(message => !(message.attachments.size === 1 && isImage(message.attachments.first().attachment)));
	oocMessages = oocMessages.filter(message => ! message.pinned); // Filter out all pinned messages
	oocMessages.forEach(message => message.delete()); // Delete all messages

	// Add all OOC images to cache
	oocMessages2 = oocMessages2.filter(message => (message.attachments.size === 1 && isImage(message.attachments.first().attachment)));
	oocMessages2.forEach(async (message) => {
		// For each image in ooc, add its ID to a set and store the image as a hash
		await redisClient.sAdd("messageIds", message.id);
		await redisClient.hSet(`${message.id}`, "imageUrl", message.attachments[0].attachment.url);
	});
	
	console.log("Ready to take commands!");
});



client.on("shardReconnecting", () => console.log("Trying to reconnect..."));
client.on("shardDisconnected", () => console.log("Disconnected."));



// A user adds reaction to a message
client.on("messageReactionAdd", async (reaction, user) => {
	if (user === client.user) return;
	if (rpsDeleteJobs.has(reaction.message.id)) {
		const validMoves = ["\u{1f311}", "\u{1f4f0}", "\u2702"]; // Moves makable in Rock Paper Scissors
		if (! validMoves.includes(reaction.emoji.name)) return; // Reacted emoji not in validMoves
		const userMove = reaction.emoji.name;
		const nickname = reaction.message.channel.type === "DM" ? user.username : (await TLAServer.members.fetch(user)).displayName;
		const computerMove = getRandomObject(validMoves); // Represents index of move computer made
		
		const discordEmbed = new Discord.MessageEmbed();
		discordEmbed
			.setColor('#ce0001')
			.addField("Unity Machine", computerMove, true)
			.addField(nickname, userMove, true)

		if (userMove === computerMove) { // Both made same move
			discordEmbed.setDescription("**Tie!**");
		} else if (userMove === "\u{1f311}" && computerMove === "\u2702" ||
					userMove === "\u{1f4f0}" && computerMove === "\u{1f311}" ||
					userMove === "\u2702" && computerMove === "\u{1f4f0}") { // Win
			discordEmbed.setDescription("**You Win!**");
		} else discordEmbed.setDescription("**You Lost!**"); // Lose

		reaction.message.edit({ embeds: [discordEmbed] });
		reaction.message.reactions.removeAll();

		rpsDeleteJobs.get(reaction.message.id).cancel(); // Cancel delete job for message
		rpsDeleteJobs.delete(reaction.message.id);
	}
});

// A user changes nickname or changes roles
client.on("guildMemberUpdate", updateCounter);

// A user's status or activity changes
client.on("presenceUpdate", updateCounter);

let unverifiedRole;
// A user joins server
client.on("guildMemberAdd", async newMember => {
	newMember.roles.add(unverifiedRole); // Add unverified role
	const welcomeMessage = eval(await fs.readFileAsync(path.join(__dirname, "data", "welcomeMessage.txt"), "utf-8")); // eval is used to add interpolation for text in welcomeMessage.txt
	try {
		newMember.user.send(welcomeMessage);
	} catch (e) {
		console.err(`Error contacting ${newMember.id}: ${e}`);
    }
	userCollections.insertOne({id: newMember.id.toString(), nation: null, time: new Date().getTime()});
	updateCounter();
});

// A user leaves/is kicked/is banned from server
client.on("guildMemberRemove", member => {
	userCollections.deleteOne({"id": member.id}); // Delete from userCollections
	scheduledReminders.deleteMany({"id": member.id}); // Delete all reminders
	updateCounter();
});

console.log("Discord.js version " + Discord.version);
client.login(process.env.BOT_TOKEN);
