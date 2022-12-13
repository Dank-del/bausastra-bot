import { CommandContext, Context } from "grammy";


export async function start(ctx: CommandContext<Context>) {
    ctx.reply(`
    <b>Hi ${ctx.from?.first_name}, I'm a bot that can help you to find the meaning of Indonesian words.</b>\n<i>Just type the word you want to search.</i>
    
    `, {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Take queries here",
                        url: "https://t.me/chiruzon"
                    }, {
                        text: "Try inline",
                        switch_inline_query_current_chat: "sayang"
                    }
                ]
            ]
        }
    })
}