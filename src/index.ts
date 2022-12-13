import { Bot } from "grammy";
import { start } from "./commands/start";
import { scrapeCambridgeIndo } from "./scraper/scraper";
import dotenv from "dotenv";
dotenv.config();
// Create an instance of the `Bot` class and pass your authentication token to it.
const bot = new Bot(process.env.BOT_TOKEN!); // <-- put your authentication token between the ""

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// Handle the /start command.
bot.command("start", start);
// Handle other messages.
bot.on("message", async (ctx) => {
    if (ctx.message?.chat.type === "private") {
        // const msg = await ctx.reply("Please wait...");
        const data = await scrapeCambridgeIndo(new String(ctx.message.text?.toString()));
        if (data.meanings.length > 0) {
            ctx.reply(data?.raw?.toString(), {
                parse_mode: "HTML"
            });
        } else {
            ctx.reply("Sorry, I don't know that word yet.");
        }
    }
});

// handle errors
bot.catch((err) => {
    console.log(`Ooops, encountered an error for ${err.message}`, err);
    console.log(err);

    bot.api.sendMessage(process.env.OWNER_ID!, `Ooops, encountered an error for ${err.message}\nError: ${err.error}\nName: ${err.name}\nStack: ${err.stack}`, {
        parse_mode: "HTML"
    });
});


bot.on("inline_query", async (ctx) => {
    if (!ctx.inlineQuery || !ctx.inlineQuery.query) {
        await ctx.answerInlineQuery(
            [
                {
                    type: "article",
                    id: "enter_query",
                    title: "Enter a query",
                    input_message_content: {
                        message_text:
                            `Enter a query to search for in the inline mode.\nYou can also use this bot in inline mode by typing @${ctx.me.username} in any chat.`,
                        parse_mode: "HTML",
                    },
                    url: `https://t.me/${ctx.me.username}`,
                    description: "Missing query",
                },
            ],
            { cache_time: 2 },
        );
    } else {
        const data = await scrapeCambridgeIndo(new String(ctx.inlineQuery.query));
        if (data.meanings.length > 0) {
            await ctx.answerInlineQuery(
                [
                    {
                        type: "article",
                        id: `meaning-${data.word}`,
                        title: data.word.toString(),
                        input_message_content: {
                            message_text: data.raw.toString(),
                            parse_mode: "HTML",
                        },
                        url: `https://t.me/${ctx.me.username}`,
                        description: data.title.toString(),
                    },
                ],
                { cache_time: 2 },
            );
        } else {
            await ctx.answerInlineQuery(
                [
                    {
                        type: "article",
                        id: `meaning-${data.word}`,
                        title: data.word.toString(),
                        input_message_content: {
                            message_text: "Sorry, I don't know that word yet.",
                            parse_mode: "HTML",
                        },
                        url: `https://t.me/${ctx.me.username}`,
                        description: data.title.toString(),
                    },
                ],
                { cache_time: 2 },
            );
        }
    }
})


// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.
scrapeCambridgeIndo("sayang").then((res) => {
    if (res.meanings.length > 0) {
        console.log("Scraper is working.. Bot will be started...");
        bot.start({
            drop_pending_updates: true,
        });
    } else {
        console.log("Scraper is not working.. Bot will not be started...");
        return;
    }
});