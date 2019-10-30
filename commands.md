`!8ball `
**Usage:** No arguments are required. However, a question can be appended at the end of the command.
**Details:** The command returns a random answer to a yes-or-no question. It can return one of 20 possible answers.
**Examples:** 
`!8ball`
`!8ball Am I lucky today?`


`!censusnum [Census Name]`

**Usage:** The census name entered must be exactly the same as the one found in the Nation Rank page.
**Details:** The command returns the Census ID number of a given Census.
**Examples:**
`!censusnum Human Development Index`
*Returns "The census number for Human Development Index is 68."*
`!censusnum Industry: Book Publishing`
*Returns "The census number for Industry: Book Publishing is 24"*


`!coinflip `

**Usage:** No arguments are required.
**Details:** The command simulates a fair coin toss and returns the result.
**Examples:**
`!coinflip`


`!deverify `

**Usage:** No arguments are required. If you are marked as "Unverified", this command will not work.
**Details:** The command allows you to be de-verified and be marked as Unverified, thus allowing you to verify as another nation.
**Examples:**
`!deverify`


`!help [Command]`

**Usage:** The specified command must have the starting "!" removed. Without a command, the function will return information on all commands.
**Details:** The command returns how to use, the purpose of, and examples of using a specified command. If a command is not specified, an overview of the purpose of all commands will be displayed.
**Examples:**
`!help`
`!help 8ball`
`!help roll`


`!hot [Subreddit] [Number of posts] [Stickied posts included]`

**Usage:** The subreddit entered must have the "\r" portion removed. All NSFW subreddits are **banned**. The number of posts argument entered must be an integer over 0 and equal to or below 20, and defaults to 5. The stickied posts argument must be "True" or "False", and defaults to False.
**Details:** The command takes a random post from the hottest (usually hottest 5) posts of a given subreddit. Then, the post title, a link to the post, and the number of upvotes will be returned. If applicable, the posts link, image, and text content will also be returned.
**Examples:**
`!hot aww`
`!hot socialism 10`
`!hot LateStageCapitalism 5 True`

`!insult [Noun]`

**Usage:** The entered noun can contain spaces.
**Details:** The command sends a message insulting something.
**Examples:**
`!insult Hitler`
`!insult fascism`


`!membercount `

**Usage:** The command takes no arguments.
**Details:** This command returns the total number of people in the server, as well as the total number of people with the Verified, Unverified, CTE, Assemblian, Visitor and each of the pronoun roles.
**Examples:**
`!membercount`


`!nanniversary [Nation]`

**Usage:** The specified nation name must have the spaces replaced with under scrolls. The nation name entered are case-insensitive.
**Details:** The command returns the number of days until a given nation's next anniversary.
**Examples:**
`!nanniversary delusija`
`!nanniversary USSRs`


`!nationclaims [Nation]`

**Usage:** The specified nation is case-sensitive.
**Detials:** The command enters the tags of all users that are verified with


`!ncensus [Census ID] [Nation]`

**Usage:** The specified Census ID must be an integer between 0 and 85. The specified nation name must have the spaces replaced with under scrolls. The nation name entered are case-insensitive. The Census IDs for each census can be found by using `!censusnum`.
**Details:** The command returns the score of the specified nation in the specified World Census. It will also display the rank and percentile of the nation in the region it resides in and the world as a whole.
**Examples:**
`!ncensus 12 leftist_assembly_founder`
`!ncensus 71 Notinhaps`
`!ncensus 66 fedele`


`!nci [Nation]`
**Usage:** The specified nation name must have the spaces replaced with under scrolls. The nation name entered are case-insensitive.
**Details:** The command returns the Comrade Index of the specified nation, plus a breakdown of the score.
**Examples:**
`!nci socialist_columbia`
`!nci sonna`
`!nci caracasus`


`!ncompare [Census ID] [Nation] [Nation 2] [Nation 3] [Nation 4] [Nation 5]`

**Usage:** The specified Census ID must be an integer between 0 and 85. The specified nation names must have the spaces replaced with under scrolls. The nation names entered are case-insensitive. Between 2 to 5 nations can be entered at once. The Census IDs for each census can be found by using `!censusnum`.
**Details:** The command returns the nation that performs the best in a given census out of all those compared. It also ranks the nations with each other and displays their scores in the given census.
**Examples:**
`!ncompare 71 the_final_horseman argentigrad`
`!ncompare 80 cedoria llorens libertasnia auven new_lonopolian_empire`


`!ncompareci [Nation] [Nation 2] [Nation 3] [Nation 4] [Nation 5]`
**Usage:** The specified nation names must have the spaces replaced with under scrolls. The nation names entered are case-insensitive. Between 2 to 5 nations can be entered at once.
**Details:** The command returns the nation that performs the best in the Comrade Index out of all those compared. It also ranks the nations with each other and displays their scores in the Comrade Index.
**Examples:**
`!ncompareci new_prague_workers_republic tannkrem`
`!ncompareci Katosima VegemiteIsGross`


`!nextholiday `

**Usage:** No arguments are required.
**Details:** The command returns the name of the next holiday and the number of days until the holiday, where "holiday" is defined under the Holiday Act. The number of days is calculated using UTC time (e.g. if it is 23:00 28/8 UTC time, then to bot will say that it is 1 day from August Farce Day, even though it is August Farce Day elsewhere).
**Examples:**
`!nextholiday`


`!ninfo [Nation]`

**Usage:** The specified nation name must have the spaces replaced with under scrolls. The nation name entered is case-insensitive.
**Details:** The command returns the flag, full name, motto, population, what it is notable for, region, WA type, largest industry, influence, endorsements (both as a number and as a percentage of WA nations in their region), average income, average income of poor, and how long ago it was founded.
**Examples:**
`!ninfo testlandia`
`!ninfo hecknamistan`
`!ninfo kavagrad`


`!npolicy [Nation]`

**Usage:** The specified nation name must have the spaces replaced with under scrolls. The nation name entered is case-insensitive.
**Details:** The command returns a text file, with the title, banner URL, and description of each policy the nation has.
**Examples:**
`!npolicy caracasus`
`!npolicy south_miruva`
`!npolicy ransium`


`!ooc `

**Usage:** The command requires no arguments.
**Details:** The command gets all sent images in the last 100 messages sent in #out-of-context. Then, it filters all images and returns a random one.
**Examples:**
`!ooc`


`!pronoun [Pronouns]`

**Usage:** The available pronouns can be found by looking at all tags that Unity Machine has been assigned. Pronouns are seperated by a space.
**Details:** The command removes all pronoun roles you already have, and assigns you the specified pronoun(s).
**Examples:**
`!pronoun he/him`
*Assigns you he/him role*
`!pronoun they/them she/her`
*Assigns you they/them and she/her roles*
`!pronoun`
*Remove all pronoun roles*


`!quote [Person]`

**Usage:** Only enter the last name of the leftist leader you want the quote from (exceptions are MLK and Malcolm X). The name is case-insensitive.
**Details:** The command returns a random quote from leftist leaders. There are 99 possible quotes that can be returned. If a leftist leader is specified, then only quotes from that person will be returned.
**Examples:**
`!quote`
`!quote Stalin`
`!quote marx`


`!randomselect [Options to select]`
**Usage:** Each option needs to be enclosed with quotes("). 
**Details:** The command takes the given options and selects a random one, then outputs the selected one.
**Examples:**
`!randomselect "Bananas" "Strawberries" "Apples"`
`!randomselect "The Pacific" "The North Pacific" "The South Pacific" "The West Pacific" "The North Pacific"`


`!rcensus [Census ID] [Region]`

**Usage:** The specified Census ID must be an integer between 0 and 85 or 255. The specified region name must have the spaces replaced with under scrolls. The region name entered is case-insensitive. If a region name is not specified, Unity Machine will find information about The Leftist Assembly. The Census IDs for each census can be found by using `!censusnum`.
**Details:** The command returns the average score of all nation in the specified region in the specified World Census. It will also display the rank and percentile of the region in the world as a whole.
**Examples:**
`!rcensus 255`
`!rcensus 0 democratic_socialist_assembly`
`!recensus 66 forest`


`!rcompare [Census ID] [Region] [Region 2] [Region 3] [Region 4] [Region 5]`

**Usage:** The specified Census ID must be an integer between 0 and 85. The specified region names must have the spaces replaced with under scrolls. The region names entered are case-insensitive. Between 2 to 5 regions can be entered at once. The Census IDs for each census can be found by using `!censusnum`.
**Details:** The command returns the region that performs the best in a given census out of all those compared. It also ranks the regions with each other and displays their scores in the given census.
**Examples:**
`!rcompare 255 the_leftist_assembly democratic_socialist_assembly the_internationale the_communist_bloc north_korea`
`!rcompare 66 the_leftist_assembly democratic_socialist_assembly social_liberal_union the_versution_federation the_communist_bloc`


`!rcpower [Region] [Region 2] [Region 3] [Region 4] [Region 5]`
**Usage:** The specified region names must have the spaces replaced with under scrolls. The region names entered are case-insensitive. Between 2 to 5 regions can be entered at once. 
**Details:** The command compares the specified regions by power, a measure of influence in the World Assembly by adding the number of delegate endoresments and the number of WA Nations. It ranks the regions with each other and displays their scores in power.
**Examples:**
`!rcpower the_communist_bloc the_leftist_assembly`
`!rcpower social_liberal_union democratic_socialist_assembly`


`!rcwa Region] [Region 2] [Region 3] [Region 4] [Region 5]`
**Usage:** The specified region names must have the spaces replaced with under scrolls. The region names entered are case-insensitive. Between 2 to 5 regions can be entered at once. 
**Details:** This command returns the region that has the most WA nations out of all those specified. It also ranks the regions with each other and displays the number of WA Nations they have.
**Examples:**
`!rcwa forest the_leftist_assembly`
`!rcwa libertarian_socialist_confederation north_korea`


`!remindme [Time after now] [String]`
**Usage:** The "Time after now" argument must be in the form of `%d%h%m` where `%` denotes a number. The `%d` part is optional. The argument is case-insensitive. The string argumrnt can contain spaces.
**Details:** This command allows a user to send a message to themself after a specified period of time. This period can be anywhere between 1 minute and 365 days. Should a user leave the server at any point, all scheduled messages will be deleted.
**Examples:**
`!remindme 1H30M Do homework`
`!remindme 13d8h0m Create poll for elections`


`!rinfo [Region]`

**Usage:** The specified region name must have the spaces replaced with under scrolls. The region name entered is case-insensitive. If a region name is not specified, Unity Machine will find information about The Leftist Assembly.
**Details:** The command returns the flag, number of nations, number of WA nations, the name of the current WA Delegate, the number of nations endorsing the delegate, the name of the founder, how long ago the region was founded, and the power of a specified region.
**Examples:**
`!rinfo`
`!rinfo the_internationale`
`!rinfo the_communist_bloc`


`!rip [Noun]`

**Usage:** The entered noun can contain spaces. If a noun is not specified, then Unity Machine will send a generic message.
**Details:** The command sends a message, starting with "Rest in Peace, " and ends with the specified noun. If a noun is not specified, then Unity Machine will send "Rest in Peace.".
**Examples:**
`!rip`
*Returns "Rest in Peace."*
`!rip Atealia`
*Returns "Rest in Peace, Atealia."*


`!roll [Dice Expression]`

**Usage:** The dice expression uses RPG dice notation (e.g. `3d6` means "roll 3 six-sided dice). Dice notation where only 1 die is rolled can have the starting "1" removed (e.g. `1d20` can be shortened into `d20`). Addition (+) and subtraction (-) can be used in the dice expression. Up to 10,000 dice can be rolled at once, with each die having up to 1,000,000,000,000 faces.
**Details:** The command simulates rolling dice and calculates what the user rolled based on the given dice expression.
**Examples:**
`!roll d20`
`!roll 2d8`
`!roll d6-d6`


`!usernation [Username and Tag]`

**Usage:** You can find the username and tag of a Discord User by clicking on their name on the right of the Discord Client in The Leftist Assembly server.
**Details:** The command returns the nation a given user is registered as.
**Examples:**
`!usernation Nott#4859`
`!usernation Kyara#3761`


`!verifyme [Nation] [Token]`

**Usage:** The specified nation name must have the spaces replaced with under scrolls. If you are marked as "Verified", this command will not work.
**Details:** The command verifies that a Discord User owns a nation, and allows them to read and send messages. If the nation is in The Leftist Assembly, they will be given the Assemblian role. If the nation is in an embassy of The Leftist Assembly, they will be given the Visitor role. Otherwise, they will not be verified successfully.
**Examples:**
`!verifyme nottinhaps XsOIoNxQWtAlZfIeRgx8obMgJWwOA6znSDmA9xJQKBA`


`!version `

**Usage:** The command requires no arguments.
**Details:** The command returns the current version of Unity Machine.
**Examples:**
`!version`


`!wikipedia [Search term]`

**Usage:** The search term can contain spaces.
**Details:** The command finds the Wikipedia page with the given search term. A summary will then be sent. If there is ambiguity, a Disambiguation List will be sent.
**Examples:**
`!wikipedia Council Communism`
`!wikipedia Ocalan`


`!zmostinfected `
**Usage:** No arguments are required.
**Details:** The command returns the 20 nations in The Leftist Assembly with the most Infected, with a link to each nation's home page.
**Examples:**
`!zmostinfected`


`!zmostzombified `
**Usage:** No arguments are required.
**Details:** The command returns the 20 nations in The Leftist Assembly with the highest proportion of zombies, with a link to each nation's home page.
**Examples:**
`!zmostzombified`


`!zstatus `

**Usage:** No arguments are required.
**Details:** The command returns the number of Survivors, Infected and Dead in The Leftist Assembly, as well as the proportion of citizens that are Survivors, Infected and Dead.
**Examples:**
`!zstatus`