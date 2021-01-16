const {Say} = require('say');
const say = new Say('darwin');

const KIDS = require('./kids.json');
const ACTIVITIES = require('./activities.json');

(async function chooseActivities(kids, activities) {
    if (!kids.length) return;

    // Pick a random activity
    const activity = pickRandom(activities);
    const [min, max] = ACTIVITIES[activity];

    // If the min is less than the # of remaining kids, start over
    if (min > kids.length) return chooseActivities(kids, activities);

    // The max # of kids is either the max # of the activity, or the # of remaining kids, whichever is lower
    const maxKids = Math.min(max, kids.length);

    // Randomly choose the # of kids between the min and max
    const numKids = random(min, maxKids);

    // Randomly choose the participants from the remaining kids
    const participants = Array(numKids).fill(null).map(() => pickRandom(kids))
    console.log(`${oxfordComma(participants)} will ${activity}`);
    await speak(`${oxfordComma(participants)} will ${activity}`);

    // Continue with the remaining kids/activities
    return chooseActivities(kids, activities);
})([...KIDS], Object.keys(ACTIVITIES));

function pickRandom(array) {
    const i = random(0, array.length - 1);
    return array.splice(i, 1)[0];
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function oxfordComma([first, ...rest]) {
    if (!rest.length) return first;
    if (rest.length === 1) return [first, ...rest].join(' and ');
    const prefix = [first, ...rest.slice(0, rest.length - 1)].join(', ');
    return [prefix, ...rest.slice(-1)].join(', and ');
}

function speak(text) {
    return new Promise((resolve, reject) => {
        say.speak(text, 'Samantha', 1.25, err => {
            if (err) reject(err);
            resolve();
        })
    });
}