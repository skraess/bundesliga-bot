const express = require('express');
const bodyParser = require('body-parser');
const db = require('./bundesligadex.json');

const app = express();
app.use(bodyParser.json());

// Load routes
app.post('/ask-rank', getRank);
app.post('/ask-specific-place', getTeamAtRank);
app.post('/ask-points', getPoints);
app.post('/ask-game-stats', getGameStats);
app.post('/ask-goal-stats', getGoalStats);
app.post('/errors', function (req, res) {
    console.error(req.body);
    res.sendStatus(200);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));

function getRank(req, res) {
    const teamname = req.body.conversation.memory['team'].value;
    const teamInfos = findTeamByName(teamname);

    if (!teamInfos) {
        res.json({
            replies: [
                { type: 'text', content: `I don't know a Bundesligateam called ${teamname} :(` },
            ],
        });
    } else {
        res.json({
            replies: [
                { type: 'text', content: `${teamInfos.name} finished the season at rank ${teamInfos.rank}.` },
            ],
        });
    }
}

function getTeamAtRank(req, res) {
    const rank = req.body.conversation.memory.ranking.place;
    const teamInfos = findTeamByRank(rank);

    res.json({
        replies: [
            { type: 'text', content: `${teamInfos.name} finished the season at rank ${teamInfos.rank}.` },
        ],
    });
}

function getPoints(req, res) {
    const teamname = req.body.conversation.memory['team'].value;
    const teamInfos = findTeamByName(teamname);

    if (!teamInfos) {
        res.json({
            replies: [
                { type: 'text', content: `I'm sorry but I don't know a Bundesligateam called ${teamname} :(` },
            ],
        });
    } else {
        res.json({
            replies: [
                { type: 'text', content: `${teamInfos.name} had ${teamInfos.points} points at the end of the season.` },
            ],
        });
    }
}

function getGameStats(req, res) {
    const teamname = req.body.conversation.memory['team'].value;
    const teamInfos = findTeamByName(teamname);

    if (!teamInfos) {
        res.json({
            replies: [
                { type: 'text', content: `I'm sorry but I don't know a Bundesligateam called ${teamname} :(` },
            ],
        });
    } else {
        res.json({
            replies: [
                { type: 'text', content: `Here are the Gamestats of ${teamInfos.name}: \n\nGames won: ${teamInfos.stats[0].number} \nDraws: ${teamInfos.stats[1].number} \nGames lost: ${teamInfos.stats[2].number}` },
            ],
        });
    }
}

function getGoalStats(req, res) {
    const teamname = req.body.conversation.memory['team'].value;
    const teamInfos = findTeamByName(teamname);

    if (!teamInfos) {
        res.json({
            replies: [
                { type: 'text', content: `I'm sorry but I don't know a Bundesligateam called ${teamname} :(` },
            ],
        });
    } else {
        res.json({
            replies: [
                { type: 'text', content: `Here are the Goalstats of ${teamInfos.name}: \n\nGoals scored: ${teamInfos.goalstats[0].number} \nGoals catched: ${teamInfos.goalstats[1].number} \nGoaldifference: ${teamInfos.goalstats[0].number-teamInfos.goalstats[1].number}` },
            ],
        });
    }
}

function findTeamByName(name) {
    const data = db.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (!data) {
        return null;
    }
    return data;
};

function findTeamByRank(rank) {
    const data = db.find(p => p.rank === rank);
    if (!data) {
        return null;
    }
    return data;
};