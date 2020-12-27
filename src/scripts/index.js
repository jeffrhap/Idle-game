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

// Prestige mechanism, fight AI, get piece of its knowledge, restart with better stats (randomized up certain stats??)



// Set all game data

const tools = [
    {
        "id": 0,
        "name": "Axe",
        "level": 1,
        "upgradeCost": 1,
        "resource": "wood",
        "resourcePerClick": 0.1
    }
];

const upgrades = [
    {
        "id": 0,
        "name": "Craft wooden leg",
        "cost": 1,
        "resource": "wood",
        "increase": 0.3,
        "upgradesRequired": [],
        "active": false
    },
    {
        "id": 1,
        "name": "Craft axe",
        "cost": 1,
        "resource": "wood",
        "increase": 0.1,
        "upgradesRequired": [],
        "active": false
    },
    {
        "id": 2,
        "name": "Craft stick",
        "cost": 1,
        "resource": "wood",
        "increase": 0,
        "upgradesRequired": [],
        "active": false
    },
    {
        "id": 3,
        "name": "Whack robot",
        "cost": 0,
        "resource": "",
        "increase": 0,
        "upgradesRequired": [2],
        "active": false
    }
];

let gameData = {
    version: 0.06,
    resources: {
        wood: 0
    },
    tools: tools,
    upgrades: upgrades
}

// Check if save exists
const savegame = JSON.parse(localStorage.getItem("saveGame"));
if (savegame !== null && savegame.version == gameData.version) {
    gameData = savegame
} else {
    localStorage.setItem('saveGame', JSON.stringify(gameData));
}

// Udate upgrades tab
const updateUpgrades = () => {
    const newUpgrades = gameData.upgrades.filter(upgrade => upgrade.active == false);
    const boughtUpgrades = gameData.upgrades.filter(upgrade => upgrade.active == true);
    const requirementsMet = newUpgrades.filter(upgrade => upgrade.upgradesRequired.length == 0 || boughtUpgrades.map(upgrade => upgrade.id).some(boughtId => upgrade.upgradesRequired.includes(boughtId)));
    
    const upgradesHtml =
        requirementsMet.map(upgrade => {
            let item = document.createElement('div');
            item.classList.add('item');
            item.dataset.upgrade = upgrade.id;

            let upgradeCopy = document.createElement('div');
            upgradeCopy.classList.add('cost');
            upgradeCopy.innerHTML = `${upgrade.name} Cost: ${upgrade.cost.toFixed(1)} Wood`;

            let button = document.createElement('div');
            button.classList.add('button');
            button.innerHTML = 'Buy';

            item.append(upgradeCopy);
            item.append(button);

            return item;
        });
    document.querySelector('[data-tab=upgrades]').innerHTML = '';
    document.querySelector('[data-tab=upgrades]').append(...upgradesHtml);

    Array.from(document.querySelectorAll('[data-upgrade]')).map(upgradeButton => upgradeButton.addEventListener('click', (e) => activateUpgrade(e)));
}

// Initialize game
const initGame = () => {
    // Set resources gathered
    document.querySelector('.wood').innerHTML = `${gameData.resources.wood.toFixed(1)} Wood chopped`;

    // Init tools tab
    const tools = gameData.tools;
    const toolsHtml =
        tools.map(tool => {
            let item = document.createElement('div');
            item.classList.add('item');
            item.dataset.tool = tool.id;

            let upgradeCopy = document.createElement('div');
            upgradeCopy.classList.add('cost');
            upgradeCopy.innerHTML = `${tool.name} (Level ${tool.level}) Cost: ${tool.upgradeCost.toFixed(1)} Wood`;

            let button = document.createElement('div');
            button.classList.add('button');
            button.innerHTML = 'Buy';

            item.append(upgradeCopy);
            item.append(button);

            return item;
        });
    document.querySelector('[data-tab=tools]').append(...toolsHtml);

    // Init upgrades tab
    updateUpgrades();
}
initGame();

// Game Functions

const chopWood = () => {
    const woodTools = gameData.tools.filter(tool => tool.resource == 'wood');
    const woodClickValues = woodTools.map(woodTool => woodTool.resourcePerClick);
    const activeWoodUpgrades = gameData.upgrades.filter(upgrade => upgrade.resource == 'wood' && upgrade.active == true);
    const woodUpgradeValues = activeWoodUpgrades.map(woodUpgrade => woodUpgrade.increase);
    const currentWoodClickValues = [...woodClickValues, ...woodUpgradeValues]
    const woodPerClick = currentWoodClickValues.reduce((perClick, current) => perClick + current);

    gameData.resources.wood += woodPerClick;
    document.querySelector('.wood').innerHTML = `${gameData.resources.wood.toFixed(1)} Wood chopped`;
}

const toolUpgrade = (e) => {
    const targetToolId = e.currentTarget.dataset.tool;
    const targetTool = gameData.tools.find(tool => tool.id == targetToolId);

    if (gameData.resources.wood >= targetTool.upgradeCost) {
        gameData.resources.wood -= targetTool.upgradeCost;
        targetTool.level += 1;
        targetTool.upgradeCost *= 1.2;
        targetTool.resourcePerClick += 0.1;
        document.querySelector('.wood').innerHTML = `${gameData.resources.wood.toFixed(1)} Wood chopped`;

        document.querySelector(`[data-tool="${targetToolId}"] .cost`).innerHTML =
            "Axe (Level " + targetTool.level + ") Cost: " + targetTool.upgradeCost.toFixed(1) + " Wood";
    }
}

const activateUpgrade = (e) => {
    console.log('upgrade')
    const targetUpgradeId = e.currentTarget.dataset.upgrade;
    const targetUpgrade = gameData.upgrades.find(upgrade => upgrade.id == targetUpgradeId);

    if (gameData.resources.wood >= targetUpgrade.cost && targetUpgrade.upgradesRequired.length == 0) {
        gameData.resources.wood -= targetUpgrade.cost;
        targetUpgrade.active = true;

        document.querySelector('.wood').innerHTML = `${gameData.resources.wood.toFixed(1)} Wood chopped`;
    } else if (gameData.resources.wood >= targetUpgrade.cost && targetUpgrade.upgradesRequired.length > 0) {
        const boughtUpgrades = gameData.upgrades.filter(upgrade => upgrade.active == true);
        const requirementsMet = boughtUpgrades.map(upgrade => upgrade.id).some(boughtId => targetUpgrade.upgradesRequired.includes(boughtId));

        if (requirementsMet) {
            gameData.resources.wood -= targetUpgrade.cost;
            targetUpgrade.active = true;

            document.querySelector('.wood').innerHTML = `${gameData.resources.wood.toFixed(1)} Wood chopped`;
        }
    }

    updateUpgrades();
}

// Main game loop
const gameLoop = setInterval(() => {

}, 1000);

// Save game loop
const saveLoop = setInterval(() => {
    console.log('saveGame')
    localStorage.setItem('saveGame', JSON.stringify(gameData));
}, 15000);

// UI STUFF

// Open ui tabs
const openTab = (e) => {
    const allTabs = document.querySelectorAll('[data-tab]');
    const targetTabName = e.currentTarget.dataset.tabOpen;
    const targetTab = document.querySelector(`[data-tab=${targetTabName}]`);

    if (!targetTab.classList.contains('active')) {
        Array.from(allTabs).map(tab => tab.classList.remove('active'));
        targetTab.classList.add('active');
    } else {
        targetTab.classList.toggle('active');
    }
}
Array.from(document.querySelectorAll('[data-tab-open]')).map(tab => tab.addEventListener('click', (e) => openTab(e)));

// MISC EVENT LISTENERS
document.querySelector('[data-button=click]').addEventListener('click', () => chopWood());
Array.from(document.querySelectorAll('[data-tool]')).map(toolButton => toolButton.addEventListener('click', (e) => toolUpgrade(e)));
