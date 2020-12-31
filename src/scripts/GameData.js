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
        "increase": 0.1,
        "upgradesRequired": [],
        "active": false
    },
    {
        "id": 1,
        "name": "Craft axe",
        "cost": 2,
        "resource": "wood",
        "increase": 0.1,
        "upgradesRequired": [],
        "active": false
    },
    {
        "id": 2,
        "name": "Craft stick",
        "cost": 5,
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

const exploration = [
    {
        "id": 0,
        "name": "Explore",
        "cost": [
            {
                "wood": 5
            }
        ],
        "duration": 5,
        "loot": [
            {
                "resource": "wood",
                "amount": 10,
                "chance": 85
            },
            {
                "resource": "people",
                "amount": 1,
                "chance": 10
            }
        ]
    }
]

const companion = {
    "resourcePerTick": "0.5"
}

let gameData = {
    version: 0.09,
    resources: {
        wood: 0
    },
    followers: {
        "people": 0
    },
    tools: tools,
    upgrades: upgrades,
    explorations: exploration,
    companion: companion
}

const loadData = () => {
    // Check if save exists
    const savegame = JSON.parse(localStorage.getItem("saveGame"));
    if (savegame !== null && savegame.version == gameData.version) {
        gameData = savegame
    } else {
        localStorage.setItem('saveGame', JSON.stringify(gameData));
    }

    return gameData;
}

const saveData = (gameData) => {
    console.log('saveGame')
    localStorage.setItem('saveGame', JSON.stringify(gameData));
}

export { loadData, saveData };

