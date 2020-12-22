import '../styles/styles.scss';

// RESOURCES
// 1. Wood
// Get 1 wood for pickaxe, 1 for leg, 1 for stick (to hit robot and wake it, starts autoharvesting 1 / s) (Upgrades) 
// Use wood to buy upgrades which increase harvesting amount (per click or for robot??)
// Beter tools can be earned / bought later to upgrade autoharvesting of wood
// Used for early base building too

// 2. Explore
// Exploring gives you rewards, randomly at the start
// One of these rewards is people you can recruit
// Later you can specify what you want to explore for (loot, resources, people...?)

// 2. People?
// Start recruiting people slowly
// People can be put to workto auto gather
// Need to build houses to be able to recruit more people
// Later people can be upgraded to armies (min number of people required)
// Something with generals and special (tiered) loot for army bonusses

// 2. Stone
// Upgrade all wooden tools
// Upgrade base

// 3. Iron
// Upgrade all stone tools
// Upgrade base

// 4. Electrical components for 'Tech' upgrades
// You can start upgrading robot with these, aswell as build more advanced tools to speed up autoharvesting
// More advanded base building

// 5. Robotics parts (premium?)

// Prestige mechanism, fight AI, get piece of its knowledge, restart with better stats

let gameData = {
    wood: 0,
    woodPerClick: 0.1,
    woodCost: 1
}

const savegame = JSON.parse(localStorage.getItem("saveGame"))
if (savegame !== null) {
    gameData = savegame
}

const upgrades = [
    {
        "title": "Craft pickaxe",
        "cost": "1",
        "increase": "0.1"
    },
    {
        "title": "Craft wooden leg",
        "cost": "1",
        "increase": "0.3"
    },
    {
        "title": "Craft stick",
        "cost": "1",
        "increase": "0"
    },
    {
        "title": "Whack robot",
        "cost": "0",
        "increase": "0"
    }
];

const initGame = () => {
    document.querySelector('.wood').innerHTML = `${gameData.wood.toFixed(1)} Wood chopped`;
    document.querySelector('.cost').innerHTML =
            "Upgrade Axe (Currently Level " + gameData.woodPerClick.toFixed(1) + ") Cost: " + gameData.woodCost.toFixed(1) + " Wood";
}

initGame();

const chopWood = () => {
    gameData.wood += gameData.woodPerClick;
    document.querySelector('.wood').innerHTML = `${gameData.wood} Wood chopped`;
}

const woodUpgrade = () => {
    if (gameData.wood >= gameData.woodCost) {
        gameData.wood -= gameData.woodCost;
        gameData.woodCost *= 1.2;
        gameData.woodPerClick += 0.1;
        document.querySelector('.wood').innerHTML = `${gameData.wood} Wood chopped`;
        document.querySelector('.cost').innerHTML =
            "Upgrade Axe (Currently Level " + gameData.woodPerClick + ") Cost: " + gameData.woodCost + " Wood";
    }
}

const gameLoop = setInterval(() => {
    
}, 1000);

const saveLoop = setInterval(() => {
    localStorage.setItem('saveGame', JSON.stringify(gameData));
}, 15000);

document.querySelector('[data-button=click]').addEventListener('click', () => chopWood());
document.querySelector('[data-button=wood]').addEventListener('click', () => woodUpgrade());
