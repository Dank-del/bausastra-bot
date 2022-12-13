import { load } from "cheerio";
import axios from "axios";

interface IScrapeResult {
    word: String;
    meanings: String[];
    title: String;
    raw: String;
}

export async function scrapeCambridgeIndo(word: String): Promise<IScrapeResult> {
    const url = `https://dictionary.cambridge.org/dictionary/indonesian-english/${word}`;
    const response = await axios.get(url);
    const $ = load(response.data);
    // console.log($.html())
    const title = $('title').text();
    const meanings = $('.def-block').map((i, element) => {
        return $(element).text().trim();
    }).get();

    //const urlQ = 'https://dictionary.cambridge.org/dictionary/indonesian-english/salah';

    // axios.get(url)
    //     .then(response => {
    //         const $ = load(response.data);

    //         // Get the title of the page
    //         const title = $('title').text();
    //         console.log(`Title: ${title}`);

    //         // Get the meanings of the word
    //         const meanings = $('.def-block').map((i, element) => {
    //             return $(element).text().trim();
    //         }).get();
    //         console.log(meanings)
    //         // console.log(`Meanings: ${meanings.join(', ')}`);
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     });

    return {
        word: word,
        meanings: meanings,
        title: title,
        raw: `
        <b>${title}</b>\n<i>${meanings.join(', ').trim()}</i>
        `
    };
}