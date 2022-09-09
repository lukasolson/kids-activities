const {Say} = require('say');
const say = new Say('darwin');

const KIDS = require('./kids.json');
const ACTIVITIES = require('./activities.json');

(async function letsPlayActivities() {
    console.log(`${new Date()}`);
    await countdown(10);
    await chooseActivities([...KIDS], Object.keys(ACTIVITIES));
    await wait(15);
    await speak('Time to clean up your activity and get ready for the next one!');
    await wait(2);
    return letsPlayActivities();
})();

async function chooseActivities(kids, activities) {
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
}

async function countdown(i) {
    if (i <= 0) return;
    await speak(`${i}`);
    return countdown(i - 1);
}

function wait(minutes) {
    return new Promise(resolve => setTimeout(resolve, minutes * 60 * 1000));
}

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
    const last = rest.pop();
    return `${[first, ...rest].join(', ')}, and ${last}`;
}

function speak(text) {
    // Speak the correct pronunciation
    const corrected = text.split('Vella').join('Vaya').split('Brynn').join('Brinn');
    return new Promise((resolve, reject) => {
        say.speak(corrected, 'Samantha', 1.25, err => {
            if (err) reject(err);
            resolve();
        })
    });
}