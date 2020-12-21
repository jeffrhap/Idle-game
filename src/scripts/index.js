import '../styles/styles.scss';

// RESOURCES
// 1. Wood
// Get 1 wood for pickaxe, 1 for leg, 1 for stick (to hit robot and wake it, starts autoharvesting 1 / s) (Upgrades) 
// Use wood to buy upgrades which increase harvesting amount (per click or for robot??)
// Beter tools can be earned / bought later to upgrade autoharvesting of wood
// Used for early base building too

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

const chopWood = () => {
    gameData.wood += gameData.woodPerClick;
    document.querySelector('.wood').innerHTML = `${gameData.wood} Wood chopped`;
}

const woodUpgrade = () => {
    if (gameData.wood >= gameData.woodCost) {
        gameData.wood -= gameData.woodCost;
        gameData.woodCost *= 1.2;
        gameData.woodPerClick += 0.1;
        document.querySelector('.cost').innerHTML = 
            "Upgrade Axe (Currently Level " + gameData.woodPerClick + ") Cost: " + gameData.woodCost + " Wood";
    }
}

const gameLoop = setInterval(() => {
    chopWood();    
}, 1000);

const saveLoop = setInterval(() => {
    localStorage.setItem('saveGame', JSON.stringify(gameData));
}, 15000);

document.querySelector('[data-button=wood]').addEventListener('click', () => woodUpgrade());
