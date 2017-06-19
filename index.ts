import * as dotenv from 'dotenv-extended';
import * as builder from 'botbuilder';
import * as restify from 'restify';

import aboutDialog from './dialogs/about';
import feedbackDialog from './dialogs/feedback';

dotenv.load();

var server = restify.createServer();
server.listen(process.env.PORT || 3978, () => {
    console.log(`${server.name} listening to ${server.url}`);
});

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, (session) => {
  session.replaceDialog('AboutDialog');
});

bot.dialog('AboutDialog', aboutDialog)
.triggerAction({
    matches: [
        /about/i,
        /author/i,
        /contact/i
    ]
});

bot.dialog('FeedbackDialog', feedbackDialog)
.triggerAction({
    matches: [
        /feedback/i,
        /review/i
    ]
});