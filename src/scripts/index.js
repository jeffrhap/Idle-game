import '../styles/styles.scss';

import { loadData, saveData } from './GameData';

import { pickLoot } from './Loot';

// RESOURCES
// 1. Wood
// Get 1 wood for pickaxe, x for leg, x for stick (to hit robot and wake it, starts autoharvesting 2 / s) (Upgrades) 
// Use wood to buy upgrades which increase harvesting amount (per click or for robot??)
// Beter tools can be earned / bought later to upgrade autoharvesting of wood
// Used for early base building too

// 2. Explore
// Exploring gives you rewards, randomly at the start
// One of these rewards is people you can recruit, for every person you want to recruit you need a house
// Later you can specify what you want to explore for (loot, resources, people...?)

// 2. Followers
// Start recruiting people slowly
// People can be put to work to auto gather (1 / s)
// Need to build houses to be able to recruit more people
// People can be upgraded in several ways (for gathering, maybe fighting later?)
// Upgrades for gathering improve auto gathering efficiency
// possible upgrade to armies (min number of people required)
// Something with generals and special (tiered) loot for army bonusses

// 2. Robot is companion
// Used for autharvesting, just as humans
// Can be upgraded much more
// Used in prestiging (gets certain multipliers after prestige)

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

// UI IDEAS

// Main visual, start out with main character and robot
// If you build more more houses and buildings appear on the map
// Starts zooming out to a small village overview when you really build allot

// Load saveGame or create new one
const gameData = loadData();

// Some global game variables
let explorationActive = false;

// Update tools tab
const updateTools = () => {
    const toolsTab = document.querySelector('[data-tab=tools]');
    const tools = gameData.tools;

    const toolsHtml =
        tools.map(tool => {
            let item = document.createElement('div');
            item.classList.add('item');
            item.dataset.tool = tool.id;

            let contentHolder = document.createElement('div');
            contentHolder.classList.add('content-holder');

            let upgradeName = document.createElement('div');
            upgradeName.classList.add('text-heading');
            upgradeName.dataset.toolName = '';
            upgradeName.innerHTML = `${tool.name}`;

            let upgradeDescription = document.createElement('div');
            upgradeDescription.classList.add('text-small', 'italic');
            upgradeDescription.dataset.toolDescription = '';
            upgradeDescription.innerHTML = `${tool.description}`;

            let upgradeLevel = document.createElement('div');
            upgradeLevel.classList.add('text-small');
            upgradeLevel.dataset.toolLevel = '';
            upgradeLevel.innerHTML = `Level ${tool.level}`;

            let button = document.createElement('div');
            button.classList.add('button');

            let buttonCopy = document.createElement('div');
            buttonCopy.classList.add('button-title');
            buttonCopy.dataset.buttonTitle = '';
            buttonCopy.innerHTML = 'Buy';

            let buttonCost = document.createElement('div');
            buttonCost.classList.add('button-small');
            buttonCost.dataset.buttonCost = '';
            buttonCost.innerHTML = `${tool.upgradeCost.toFixed(1)} Wood`;

            contentHolder.append(upgradeName);
            contentHolder.append(upgradeDescription);
            contentHolder.append(upgradeLevel);

            button.append(buttonCopy);
            button.append(buttonCost);

            item.append(contentHolder);
            item.append(button);

            return item;
        });

    toolsTab.innerHTML = '';
    toolsTab.append(...toolsHtml);

    Array.from(document.querySelectorAll('[data-tool]'))
        .map(toolButton => toolButton.addEventListener('click', (e) => toolUpgrade(e)));
}

// Update upgrades tab
const updateUpgrades = () => {
    const upgradesTab = document.querySelector('[data-tab=upgrades]');
    const newUpgrades = gameData.upgrades.filter(upgrade => upgrade.active == false);
    const boughtUpgrades = gameData.upgrades.filter(upgrade => upgrade.active == true);
    const requirementsMet = newUpgrades.filter(upgrade => upgrade.upgradesRequired.length == 0 || boughtUpgrades.map(upgrade => upgrade.id).some(boughtId => upgrade.upgradesRequired.includes(boughtId)));

    const upgradesHtml =
        requirementsMet.map(upgrade => {
            let item = document.createElement('div');
            item.classList.add('item');
            item.dataset.upgrade = upgrade.id;

            let contentHolder = document.createElement('div');
            contentHolder.classList.add('content-holder');

            let upgradeName = document.createElement('div');
            upgradeName.classList.add('text-heading');
            upgradeName.dataset.upgradeName = '';
            upgradeName.innerHTML = `${upgrade.name}`;

            let upgradeDescription = document.createElement('div');
            upgradeDescription.classList.add('text-small', 'italic');
            upgradeDescription.dataset.upgradeDescription = '';
            upgradeDescription.innerHTML = `${upgrade.description}`;

            let button = document.createElement('div');
            button.classList.add('button');

            let buttonCopy = document.createElement('div');
            buttonCopy.classList.add('button-title');
            buttonCopy.dataset.buttonTitle = '';
            buttonCopy.innerHTML = 'Buy';

            let buttonCost = document.createElement('div');
            buttonCost.classList.add('button-small');
            buttonCost.dataset.buttonCost = '';
            buttonCost.innerHTML = `${upgrade.cost.toFixed(1)} Wood`;

            contentHolder.append(upgradeName);
            contentHolder.append(upgradeDescription);

            button.append(buttonCopy);
            button.append(buttonCost);

            item.append(contentHolder);
            item.append(button);

            return item;
        });

    upgradesTab.innerHTML = '';

    upgradesHtml.length > 0 ?
        upgradesTab.append(...upgradesHtml) :
        upgradesTab.append('No upgrades currently available');

    Array.from(document.querySelectorAll('[data-upgrade]'))
        .map(upgradeButton => upgradeButton.addEventListener('click', (e) => activateUpgrade(e)));
}

// Update explorations tab
const updateExplorations = () => {
    const explorationsTab = document.querySelector('[data-tab=explore]');
    const explorations = gameData.explorations;

    const explorationsHtml =
        explorations.map(exploration => {
            let item = document.createElement('div');
            item.classList.add('item');
            item.dataset.exploration = exploration.id;

            let contentHolder = document.createElement('div');
            contentHolder.classList.add('content-holder');

            let explorationName = document.createElement('div');
            explorationName.classList.add('text-heading');
            explorationName.dataset.explorationName = '';
            explorationName.innerHTML = `${exploration.name}`;

            let explorationDescription = document.createElement('div');
            explorationDescription.classList.add('text-small', 'italic');
            explorationDescription.dataset.explorationDescription = '';
            explorationDescription.innerHTML = `${exploration.description}`;

            let progressBar = document.createElement('div');
            progressBar.classList.add('progress-holder');

            let progressFill = document.createElement('div');
            progressFill.classList.add('progress-fill');
            progressFill.dataset.explorationProgress = '';

            let progressTime = document.createElement('div');
            progressTime.classList.add('progress-time');
            progressTime.dataset.explorationTime = '';
            progressTime.innerHTML = exploration.duration < 60 ?
                `00:${exploration.duration}` :
                `${exploration.duration / 60}:${exploration.duration - ((exploration.duration / 60) * 60)}`;

            let button = document.createElement('div');
            button.classList.add('button');

            let buttonCopy = document.createElement('div');
            buttonCopy.classList.add('button-title');
            buttonCopy.dataset.buttonTitle = '';
            buttonCopy.innerHTML = 'Go!';

            let buttonCost = document.createElement('div');
            buttonCost.classList.add('button-small');
            buttonCost.dataset.buttonCost = '';
            buttonCost.innerHTML = `${exploration.cost[0].wood.toFixed(1)} Wood`;

            contentHolder.append(explorationName);
            contentHolder.append(explorationDescription);

            progressBar.append(progressFill);
            progressBar.append(progressTime);

            button.append(buttonCopy);
            button.append(buttonCost);

            item.append(contentHolder);
            item.append(progressBar);
            item.append(button);

            return item;
        })

    explorationsTab.innerHTML = '';
    explorationsTab.append(...explorationsHtml);

    Array.from(document.querySelectorAll('[data-exploration]'))
        .map(upgradeButton => upgradeButton.addEventListener('click', (e) => activateExploration(e)));
}

const updateCompanion = () => {
    
}

// Initialize game
const initGame = () => {
    // Set resources gathered
    document.querySelector('[data-resource=wood]').innerHTML = `${gameData.resources.wood.toFixed(1)} Wood chopped`;

    // Init tools tab
    updateTools();

    // Init upgrades tab
    updateUpgrades();

    // Init explorations tab
    updateExplorations();
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
        targetTool.upgradeCost = 1 * (Math.pow(1.15, targetTool.level));
        targetTool.resourcePerClick += 0.1;
        document.querySelector('.wood').innerHTML = `${gameData.resources.wood.toFixed(1)} Wood chopped`;

        document.querySelector(`[data-tool="${targetToolId}"] [data-button-cost]`).innerHTML =
            `${targetTool.upgradeCost.toFixed(1)} Wood`;

        document.querySelector(`[data-tool="${targetToolId}"] [data-tool-level]`).innerHTML =
            `Level ${targetTool.level}`;
    }

    updateTools();
}

const activateUpgrade = (e) => {
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

const activateExploration = (e) => {
    const targetExplorationId = e.currentTarget.dataset.exploration;
    const targetExploration = gameData.explorations.find(exploration => exploration.id == targetExplorationId);

    if (gameData.resources.wood >= targetExploration.cost[0].wood && explorationActive === false) {
        explorationActive = true;

        gameData.resources.wood -= targetExploration.cost[0].wood;
        document.querySelector('[data-resource=wood]').innerHTML = `${gameData.resources.wood.toFixed(1)} Wood chopped`;

        let timer = 0;
        const expeditionTimer = setInterval(() => {
            timer++;

            let progress = (100 / targetExploration.duration) * timer;
           
            document.querySelector(`[data-exploration="${targetExplorationId}"] [data-exploration-progress]`)
                .style.width = `${progress}%`;

            document.querySelector(`[data-exploration="${targetExplorationId}"] [data-exploration-time]`)
                .innerHTML = `00:${("0" + (targetExploration.duration - timer)).slice(-2)}`;
        }, 1000);

        setTimeout(() => {
            clearInterval(expeditionTimer);

            const lootList = targetExploration.loot;
            const loot = pickLoot(lootList);
            const resource = loot.resource;
            const amount = loot.amount;

            if (resource != 'people') {
                gameData.resources[resource] += amount;
            } else if (resource == 'people') {
                gameData.followers.people += amount;
            } else {
                console.error('Unknown resource drop')
            }
            console.log('DROP: ', resource, ' ', amount)
            document.querySelector('[data-resource=wood]').innerHTML = `${gameData.resources.wood.toFixed(1)} Wood chopped`;

            updateExplorations();
        }, targetExploration.duration * 1000);
    }
}

const harvestResources = () => {
    const harvestAmount = gameData.companion.resourcePerTick;
    gameData.resources.wood += parseFloat(harvestAmount);
    document.querySelector('[data-resource=wood]').innerHTML = `${gameData.resources.wood.toFixed(1)} Wood chopped`;
}

// Main game loop
const gameLoop = setInterval(() => {
    const automationEnabled = gameData.upgrades.filter(upgrade => (upgrade.id == 2 && upgrade.active == true)).length > 0;
    automationEnabled ? harvestResources() : null;
}, 1000);

// Save game loop
const saveLoop = setInterval(() => {
    saveData(gameData);
}, 10000);

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
Array.from(document.querySelectorAll('[data-tab-open]'))
    .map(tab => tab.addEventListener('click', (e) => openTab(e)));

// MISC EVENT LISTENERS
document.querySelector('[data-button=click]').addEventListener('click', () => chopWood());
