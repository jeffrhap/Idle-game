// Set all game data

const tools = [
    {
        "id": 0,
        "name": "Wooden Axe",
        "description": "Primitive tool to gather wood",
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
        "description": "Wooden leg to be a little more mobile, replacing the leg you lost in the crash",
        "cost": 1,
        "resource": "wood",
        "increase": 0.1,
        "upgradesRequired": [],
        "active": false
    },
    {
        "id": 1,
        "name": "Craft stick",
        "description": "Make a wooden stick, what could I use this for...?",
        "cost": 5,
        "resource": "wood",
        "increase": 0,
        "upgradesRequired": [],
        "active": false
    },
    {
        "id": 2,
        "name": "Whack robot",
        "description": "Whack the robot on the floor next to you with the stick you just made..",
        "cost": 0,
        "resource": "",
        "increase": 0,
        "upgradesRequired": [1],
        "active": false
    }
];

const exploration = [
    {
        "id": 0,
        "name": "Explore",
        "description": "Basic exploration",
        "cost": [
            {
                "wood": 5
            }
        ],
        "duration": 30,
        "loot": [
            {
                "resource": "wood",
                "amount": 10,
                "chance": 90
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
    version: 0.11,
    lastSave: Math.floor(Date.now() / 1000),
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
        gameData = savegame; 

        const lastSave = gameData.lastSave;
        const currentTime = Math.floor(Date.now() / 1000);
        const timeOffline = currentTime - lastSave;
        
        timeOffline > 30 ? calculateOfflineIncome(timeOffline) : null;
    } else {
        localStorage.setItem('saveGame', JSON.stringify(gameData));
    }

    return gameData;
}

const saveData = (gameData) => {
    console.log('saveGame')
    gameData.lastSave = Math.floor(Date.now() / 1000);
    localStorage.setItem('saveGame', JSON.stringify(gameData));
}

const calculateOfflineIncome = (timeOffline) => {
    console.log(timeOffline)
}

export { loadData, saveData };

