const express = require('express')
const readline = require('readline');
const conn = require('./database');
const moment = require('moment');

const app = express()
const port = 3000



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const fs = require('fs');

app.get('/test', (req, res) => {
    res.status(200).json({ message: "API test endpoint reached" });
});

// reset database (will lead you to re-axtract)
app.get('/delete_all', async (req, res) => {
    const [user] = await (await conn).query("DELETE FROM tbl_users WHERE 1");
    const [entity] = await (await conn).query("DELETE FROM tbl_entities  WHERE 1");
    const [twett] = await (await conn).query("DELETE FROM tbl_tweets WHERE 1");
    res.status(200).json({ message: "Data Reset Complete" });
});

//extract data route
app.get('/extract', async (req, res) => {

    let filename = 'query2_ref.txt';

    try {

        const readStream = fs.createReadStream(filename, 'utf8');


        const rl = readline.createInterface({
            input: readStream,
            crlfDelay: Infinity
        });

        let lineCount = 0;

        //########################
        // line by line extract tweet
        rl.on('line', async (line) => {

            lineCount++;

            const parsedJson = JSON.parse(line);
            const userJson = parsedJson.user;
            const entities = parsedJson.entities;

            //################################
            //start checking Malformed Tweets
            if (!entities.hashtags || entities.hashtags.length === 0) {
                console.log('zero hashtags detected');
                return;
            }

            let isTweetObjectOk = (parsedJson.created_at !== null && parsedJson.created_at !== undefined) && (parsedJson.id !== null && parsedJson.id !== undefined) && (parsedJson.text !== null && parsedJson.text !== undefined);
            if (!isTweetObjectOk) {
                console.log('one or more key in tweet object is missing or null');
                return;
            }

            let isUserObjectOk = userJson.id !== null && userJson.id !== undefined;

            if (!isUserObjectOk) {
                console.log('one or more key in user object is missing or null');
                return;
            }
            // end checking Malformed Tweets


            //check if same user registred before.
            const [chechUser] = await (await conn).query("SELECT * FROM tbl_users WHERE id = ?", [BigInt(userJson.id)]);

            if (chechUser.length > 0) {
                console.log('Already registered!')
            } else {
                try {

                    const created_at = moment(userJson.created_at, "ddd MMM DD HH:mm:ss Z YYYY").toDate();

                    const [user] = await (await conn).query("INSERT INTO tbl_users(id, id_str, name, screen_name, location, url, description, protected, followers_count, friends_count, listed_count, favourites_count, utc_offset, time_zone, geo_enabled, verified, statuses_count, lang, contributors_enabled, is_translator, is_translation_enabled, profile_background_color, profile_background_image_url, profile_background_image_url_https, profile_background_tile, profile_image_url, profile_image_url_https, profile_link_color, profile_sidebar_border_color, profile_sidebar_fill_color, profile_text_color, profile_use_background_image, default_profile, default_profile_image, following, follow_request_sent, notifications, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [BigInt(userJson.id), userJson.id_str, userJson.name, userJson.screen_name, userJson.location, userJson.url, userJson.description, userJson.protected, userJson.followers_count, userJson.friends_count, userJson.listed_count, userJson.favourites_count, userJson.utc_offset, userJson.time_zone, userJson.geo_enabled, userJson.verified, userJson.statuses_count, userJson.lang, userJson.contributors_enabled, userJson.is_translator, userJson.is_translation_enabled, userJson.profile_background_color, userJson.profile_background_image_url, userJson.profile_background_image_url_https, userJson.profile_background_tile, userJson.profile_image_url, userJson.profile_image_url_https, userJson.profile_link_color, userJson.profile_sidebar_border_color, userJson.profile_sidebar_fill_color, userJson.profile_text_color, userJson.profile_use_background_image, userJson.default_profile, userJson.default_profile_image, userJson.following, userJson.follow_request_sent, userJson.notifications, created_at]);

                } catch (err) {
                    console.error('Error inserting user:', err);
                }
            }

            let hashtags_str = '';

            for (let index = 0; index < entities.hashtags.length; index++) {
                hashtags_str += entities.hashtags[index].text;
                hashtags_str += ', ';
            }

            hashtags_str = hashtags_str.trim().slice(0, -1);
            // console.log(hashtags_str);

            const [entity] = await (await conn).query("INSERT INTO tbl_entities(hashtags, hashtags_str, symbols, urls, user_mentions) VALUES (?,?,?,?,?)", [hashtags_str, JSON.stringify(entities.hashtags), JSON.stringify(entities.symbols), JSON.stringify(entities.urls), JSON.stringify(entities.user_mentions)]);

            let entity_id = entity.insertId;

            //check if same tweet is inserted.
            const [chechTwett] = await (await conn).query("SELECT * FROM tbl_tweets WHERE id = ?", [parsedJson.id]);

            if (chechTwett.length) {
                console.log('Already saved!')
            } else {
                try {


                    const created_at = moment(parsedJson.created_at, "ddd MMM DD HH:mm:ss Z YYYY").toDate();

                    let type = (parsedJson.retweeted_status !== null && parsedJson.retweeted_status !== undefined) ? 'retweet' : 'tweet';
                    let retweeted_status = parsedJson.retweeted_status ?? null;

                    const [twett] = await (await conn).query("INSERT INTO tbl_tweets(id, type, id_str, text, source, truncated, in_reply_to_status_id, in_reply_to_status_id_str, in_reply_to_user_id, in_reply_to_user_id_str, in_reply_to_screen_name, user, geo, coordinates, place, contributors, retweet_count, favorite_count, entities, hashtags_str, favorited, retweeted, possibly_sensitive, filter_level, retweeted_status, retweeted_of_user, lang, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [BigInt(parsedJson.id), type, parsedJson.id_str, parsedJson.text, parsedJson.source, parsedJson.truncated, (parsedJson.in_reply_to_status_id !== null ? BigInt(parsedJson.in_reply_to_status_id) : null), parsedJson.in_reply_to_status_id_str, (parsedJson.in_reply_to_user_id !== null ? BigInt(parsedJson.in_reply_to_user_id) : null), parsedJson.in_reply_to_user_id_str, parsedJson.in_reply_to_screen_name, BigInt(userJson.id) ?? null, parsedJson.geo, parsedJson.coordinates, parsedJson.place, parsedJson.contributors, parsedJson.retweet_count, parsedJson.favorite_count, entity_id, hashtags_str, parsedJson.favorited, parsedJson.retweeted, parsedJson.possibly_sensitive, parsedJson.filter_level, retweeted_status !== null ? JSON.stringify(retweeted_status) : null, retweeted_status !== null ? retweeted_status.user.id : null, parsedJson.lang, created_at]);

                    if (retweeted_status !== null && retweeted_status.user.id !== null && retweeted_status.user.id !== undefined) {

                        const [chechUser2] = await (await conn).query("SELECT * FROM tbl_users WHERE id = ?", [BigInt(retweeted_status.user.id)]);

                        const userJson2 = retweeted_status.user;

                        if (chechUser2.length <= 0) {

                            const created_at = moment(userJson2.created_at, "ddd MMM DD HH:mm:ss Z YYYY").toDate();

                            const [user] = await (await conn).query("INSERT INTO tbl_users(id, id_str, name, screen_name, location, url, description, protected, followers_count, friends_count, listed_count, favourites_count, utc_offset, time_zone, geo_enabled, verified, statuses_count, lang, contributors_enabled, is_translator, is_translation_enabled, profile_background_color, profile_background_image_url, profile_background_image_url_https, profile_background_tile, profile_image_url, profile_image_url_https, profile_link_color, profile_sidebar_border_color, profile_sidebar_fill_color, profile_text_color, profile_use_background_image, default_profile, default_profile_image, following, follow_request_sent, notifications, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [BigInt(userJson2.id), userJson2.id_str, userJson2.name, userJson2.screen_name, userJson2.location, userJson2.url, userJson2.description, userJson2.protected, userJson2.followers_count, userJson2.friends_count, userJson2.listed_count, userJson2.favourites_count, userJson2.utc_offset, userJson2.time_zone, userJson2.geo_enabled, userJson2.verified, userJson2.statuses_count, userJson2.lang, userJson2.contributors_enabled, userJson2.is_translator, userJson2.is_translation_enabled, userJson2.profile_background_color, userJson2.profile_background_image_url, userJson2.profile_background_image_url_https, userJson2.profile_background_tile, userJson2.profile_image_url, userJson2.profile_image_url_https, userJson2.profile_link_color, userJson2.profile_sidebar_border_color, userJson2.profile_sidebar_fill_color, userJson2.profile_text_color, userJson2.profile_use_background_image, userJson2.default_profile, userJson2.default_profile_image, userJson2.following, userJson2.follow_request_sent, userJson2.notifications, created_at]);

                        }

                    }

                } catch (err) {
                    console.error('Error inserting tweet:', err);
                }
            }


        });


        rl.on('close', () => {
            console.log('Extract complete');
            res.status(200).json({ message: "File Extracted Queued Successfully, Now is in Background Progressing!", extractedTweets: lineCount });
        });

    } catch (err) {
        console.error('Error reading file:', err);
        res.status(500).send('Internal Server Error');
    }

});


//User Recommendation Route
app.get('/q2', async (req, res) => {

    try {
        let user_id = req.query.user_id;
        let type = req.query.type;
        let phrase = req.query.phrase;
        let hashtag = req.query.hashtag;

        let sql = "SELECT * FROM tbl_tweets WHERE";

        if (type == 'reply') {
            sql += " in_reply_to_status_id = '" + user_id + "'";
        } else if (type == 'retweet') {
            sql += " retweeted_of_user = '" + user_id + "'";
        } else {
            sql += " retweeted_of_user = '" + user_id + "' OR in_reply_to_status_id = '" + user_id + "'";
        }

        const [tweets] = await (await conn).query(sql);


        for (let index = 0; index < tweets.length; index++) {

            tweets[index].keyword_score = countOccurrences(tweets[index].text, phrase);
            tweets[index].hashtag_score = countOccurrencesInsensitve(tweets[index].hashtags_str, hashtag);

            const [r] = await (await conn).query("SELECT COUNT(id) AS replies FROM tbl_tweets WHERE in_reply_to_status_id='" + user_id + "' AND user='" + tweets[index].user + "'");
            const [re] = await (await conn).query("SELECT COUNT(id) AS retweets FROM tbl_tweets WHERE retweeted_of_user='" + user_id + "' AND user='" + tweets[index].user + "'");

            tweets[index].interation_score = Math.log(1 + (2 * r[0].replies) + re[0].retweets);
            tweets[index].final_score = tweets[index].interation_score * tweets[index].hashtag_score * tweets[index].keyword_score;


            const [user] = await (await conn).query("SELECT * FROM tbl_users WHERE id='" + tweets[index].user + "'");

            tweets[index].user_object = user[0].id !== undefined ? user[0] : 'na';

        }


        const keyToSortBy = 'final_score';
        tweets.sort((a, b) => b[keyToSortBy] - a[keyToSortBy]);

        let output = '';

        for (let index = 0; index < tweets.length; index++) {

            output += tweets[index].user + "\t" + (tweets[index].user_object != 'na' ? (tweets[index].user_object.screen_name) : 'N/A') + "\t" + (tweets[index].user_object != 'na' ? (tweets[index].user_object.description) : 'N/A') + "\t" + tweets[index].text;

        }

        res.type('text/plain').send(output);
    } catch (err) {
        res.type('text/plain').send("Error Happens; Check request URL if there is none of query paramenters missing");
    }

});


function countOccurrences(mainString, subString) {
    const regex = new RegExp(subString, 'i');
    const matches = mainString.match(regex);
    let counts = matches ? matches.length : 0;
    return counts == 0 ? 0 : (1 + Math.log(counts + 1))
}

function countOccurrencesInsensitve(mainString, subString) {
    const regex = new RegExp(subString);
    const matches = mainString.match(regex);
    let counts = matches ? matches.length : 0;
    return counts > 10 ? (1 + Math.log(1 + counts - 10)) : 1;
}

app.listen(port, () => { console.log('Awesome App Started at Port ' + port) });