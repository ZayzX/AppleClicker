let currentApple = 0;
let totalApple = 0;
let applePerClick = 1;
let productionPerSecond = 0;
let goldenAppleActive = false;
let productionMultiplier = 1;
let bonusTextTimeout = null;
let timerInterval = null;
let remainingTime = 0;

let currentAppleP = document.getElementById("CurrentApple");
let totalAppleP = document.getElementById("totalApple");
let bonusTextP = document.getElementById("bonusText");
let timerDisplayP = document.getElementById("timerDisplay");
let soundClick = document.getElementById("sound");
let buildingsScrollBox = document.getElementById("buildingsScrollBox");
let upgradesScrollBox = document.getElementById("upgradesScrollBox");
let goldenAppleElement = document.getElementById("goldenApple");

let currentResourcepack = {
    appleImage: "img/pomme.png",
    goldenAppleImage: "img/golden_apple.png",
    sound: "sounds/UISoundClick.mp3",
    cursorDefault: "img/apple.png",
    cursorDefaultHotspotX: 16,
    cursorDefaultHotspotY: 16,
    cursorInteractive: "img/green_apple.png",
    cursorInteractiveHotspotX: 16,
    cursorInteractiveHotspotY: 16,
    favicon: "img/pomme.png"
};

function loadDefaultResourcepack() {
    currentResourcepack = {
        appleImage: "img/pomme.png",
        goldenAppleImage: "img/golden_apple.png",
        sound: "sounds/UISoundClick.mp3",
        cursorDefault: "img/apple.png",
        cursorDefaultHotspotX: 16,
        cursorDefaultHotspotY: 16,
        cursorInteractive: "img/green_apple.png",
        cursorInteractiveHotspotX: 16,
        cursorInteractiveHotspotY: 16,
        favicon: "img/pomme.png"
    };
    applyResourcepack();
    localStorage.removeItem("customResourcepack");
    showBonusText("Default resourcepack loaded ✅");
}

function applyResourcepack() {
    const appleImg = document.querySelector('.main-button img:first-child');
    if (appleImg) appleImg.src = currentResourcepack.appleImage;
    
    goldenAppleElement.src = currentResourcepack.goldenAppleImage;
    
    soundClick.src = currentResourcepack.sound;
    
    const defaultHotX = currentResourcepack.cursorDefaultHotspotX || 0;
    const defaultHotY = currentResourcepack.cursorDefaultHotspotY || 0;
    if (currentResourcepack.cursorDefault) {
        document.body.style.cursor = `url('${currentResourcepack.cursorDefault}') ${defaultHotX} ${defaultHotY}, auto`;
    }
    
    const interactiveHotX = currentResourcepack.cursorInteractiveHotspotX || 0;
    const interactiveHotY = currentResourcepack.cursorInteractiveHotspotY || 0;
    if (currentResourcepack.cursorInteractive) {
        const interactiveCursorStyle = `url('${currentResourcepack.cursorInteractive}') ${interactiveHotX} ${interactiveHotY}, auto`;
        
        let styleEl = document.getElementById('resourcepack-cursor-style');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'resourcepack-cursor-style';
            document.head.appendChild(styleEl);
        }
        styleEl.innerHTML = `
            .clickerContainer button,
            .building-item,
            .upgrade-item,
            .save-button,
            #goldenApple {
                cursor: ${interactiveCursorStyle} !important;
            }
        `;
    }
    
    let favicon = document.querySelector("link[rel='shortcut icon']");
    if (favicon) favicon.href = currentResourcepack.favicon;
}

function loadResourcepack() {
    const fileInput = document.getElementById('resourcepackInput');
    fileInput.click();
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
            loadResourcepackFromZip(file);
        } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
            loadResourcepackFromJSON(file);
        } else {
            showBonusText('Error: Invalid file type (use .zip or .json) ❌');
        }
    };
}

function loadResourcepackFromJSON(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const resourcepackData = JSON.parse(event.target.result);
            
            if (resourcepackData.appleImage) currentResourcepack.appleImage = resourcepackData.appleImage;
            if (resourcepackData.goldenAppleImage) currentResourcepack.goldenAppleImage = resourcepackData.goldenAppleImage;
            if (resourcepackData.sound) currentResourcepack.sound = resourcepackData.sound;
            if (resourcepackData.cursorDefault) currentResourcepack.cursorDefault = resourcepackData.cursorDefault;
            if (resourcepackData.cursorDefaultHotspotX !== undefined) currentResourcepack.cursorDefaultHotspotX = resourcepackData.cursorDefaultHotspotX;
            if (resourcepackData.cursorDefaultHotspotY !== undefined) currentResourcepack.cursorDefaultHotspotY = resourcepackData.cursorDefaultHotspotY;
            if (resourcepackData.cursorInteractive) currentResourcepack.cursorInteractive = resourcepackData.cursorInteractive;
            if (resourcepackData.cursorInteractiveHotspotX !== undefined) currentResourcepack.cursorInteractiveHotspotX = resourcepackData.cursorInteractiveHotspotX;
            if (resourcepackData.cursorInteractiveHotspotY !== undefined) currentResourcepack.cursorInteractiveHotspotY = resourcepackData.cursorInteractiveHotspotY;
            if (resourcepackData.favicon) currentResourcepack.favicon = resourcepackData.favicon;
            
            localStorage.setItem("customResourcepack", JSON.stringify(currentResourcepack));
            
            applyResourcepack();
            showBonusText('Resourcepack loaded ✅');
        } catch (error) {
            showBonusText('Error: Invalid JSON file ❌');
            console.error('Error loading resourcepack:', error);
        }
    };
    reader.readAsText(file);
}

function loadResourcepackFromZip(file) {
    JSZip.loadAsync(file).then(function(zip) {
        return zip.file('pack.json').async('text').then(function(packJsonContent) {
            const packData = JSON.parse(packJsonContent);
            const resourcepackData = {};
            
            const filePromises = [];
            
            const loadResource = (resourcePath, fieldName) => {
                if (packData[fieldName]) {
                    const promise = zip.file(packData[fieldName]).async('blob').then(blob => {
                        const blobUrl = URL.createObjectURL(blob);
                        resourcepackData[fieldName] = blobUrl;
                    });
                    filePromises.push(promise);
                }
            };
            
            loadResource('appleImage', 'appleImage');
            loadResource('goldenAppleImage', 'goldenAppleImage');
            loadResource('sound', 'sound');
            loadResource('cursorDefault', 'cursorDefault');
            loadResource('cursorInteractive', 'cursorInteractive');
            loadResource('favicon', 'favicon');
            
            if (packData.cursorDefaultHotspotX !== undefined) resourcepackData.cursorDefaultHotspotX = packData.cursorDefaultHotspotX;
            if (packData.cursorDefaultHotspotY !== undefined) resourcepackData.cursorDefaultHotspotY = packData.cursorDefaultHotspotY;
            if (packData.cursorInteractiveHotspotX !== undefined) resourcepackData.cursorInteractiveHotspotX = packData.cursorInteractiveHotspotX;
            if (packData.cursorInteractiveHotspotY !== undefined) resourcepackData.cursorInteractiveHotspotY = packData.cursorInteractiveHotspotY;
            
            return Promise.all(filePromises).then(() => resourcepackData);
        });
    }).then(function(resourcepackData) {
        Object.assign(currentResourcepack, resourcepackData);
        
        localStorage.setItem("customResourcepack", JSON.stringify(currentResourcepack));
        
        applyResourcepack();
        showBonusText('Resourcepack loaded ✅');
    }).catch(function(error) {
        showBonusText('Error: Invalid ZIP file ❌');
        console.error('Error loading resourcepack ZIP:', error);
    });
}

const buildings = [
    { name: "Grandmother", description: "A nice grandmother", baseCost: 15, production: 0.1, owned: 0 },
    { name: "Farm", description: "Grows apples", baseCost: 100, production: 1, owned: 0 },
    { name: "Orchard", description: "Many apple trees", baseCost: 1100, production: 8, owned: 0 },
    { name: "Plantation", description: "Large-scale production", baseCost: 12000, production: 47, owned: 0 },
    { name: "Factory", description: "Apple processing factory", baseCost: 130000, production: 260, owned: 0 },
    { name: "Warehouse", description: "Massive storage", baseCost: 1400000, production: 1400, owned: 0 },
    { name: "Laboratory", description: "Apple research", baseCost: 20000000, production: 7800, owned: 0 },
    { name: "Bank", description: "Financial services", baseCost: 330000000, production: 44000, owned: 0 },
    { name: "Temple", description: "Divine production", baseCost: 5100000000, production: 260000, owned: 0 },
    { name: "Wizard Tower", description: "Magical apples", baseCost: 75000000000, production: 1600000, owned: 0 },
    { name: "Shipment", description: "Global distribution", baseCost: 1000000000000, production: 10000000, owned: 0 },
    { name: "Alchemy Lab", description: "Transform metals to apples", baseCost: 14000000000000, production: 65000000, owned: 0 },
    { name: "Portal", description: "Interdimensional apples", baseCost: 170000000000000, production: 430000000, owned: 0 },
    { name: "Timemachine", description: "Apples from past", baseCost: 2100000000000000, production: 2900000000, owned: 0 },
    { name: "Quantum Computer", description: "Quantum apple probability", baseCost: 26000000000000000, production: 21000000000, owned: 0 },
    { name: "Antimatter Reactor", description: "Ultimate energy", baseCost: 310000000000000000, production: 150000000000, owned: 0 },
    { name: "Singularity", description: "Black hole of apples", baseCost: 3700000000000000000, production: 1100000000000, owned: 0 },
    { name: "Big Bang Machine", description: "Create universes", baseCost: 44000000000000000000, production: 8500000000000, owned: 0 },
    { name: "Omniscience Device", description: "Know all apples", baseCost: 520000000000000000000, production: 64000000000000, owned: 0 },
    { name: "Godly Realm", description: "Divine apple production", baseCost: 6300000000000000000000, production: 480000000000000, owned: 0 }
];

const upgrades = [];

const clickUpgrades = [
    { name: "Better Clicker", description: "+1 apple per click", type: "click", value: 1, cost: 100 },
    { name: "Master Clicker", description: "+2 apples per click", type: "click", value: 2, cost: 500 },
    { name: "Expert Clicker", description: "+3 apples per click", type: "click", value: 3, cost: 2000 },
    { name: "Supreme Clicker", description: "+5 apples per click", type: "click", value: 5, cost: 10000 },
    { name: "Divine Clicker", description: "+10 apples per click", type: "click", value: 10, cost: 100000 },
];

clickUpgrades.forEach((upgrade, i) => {
    upgrades.push({ ...upgrade, purchased: false });
});

const buildingUpgradeTypes = [
    { suffix: "Efficiency I", multiplier: 1.5, costMultiplier: 0.5 },
    { suffix: "Efficiency II", multiplier: 2, costMultiplier: 1.5 },
    { suffix: "Efficiency III", multiplier: 2.5, costMultiplier: 3 },
    { suffix: "Speed I", multiplier: 1.5, costMultiplier: 0.8 },
    { suffix: "Speed II", multiplier: 2, costMultiplier: 2 },
    { suffix: "Turbo", multiplier: 3, costMultiplier: 5 },
    { suffix: "Double", multiplier: 2, costMultiplier: 2.5 },
    { suffix: "Triple", multiplier: 3, costMultiplier: 4 },
    { suffix: "Mastery I", multiplier: 1.2, costMultiplier: 0.3 },
    { suffix: "Mastery II", multiplier: 1.5, costMultiplier: 1 },
    { suffix: "Ultimate", multiplier: 5, costMultiplier: 10 },
    { suffix: "Eternal", multiplier: 10, costMultiplier: 50 }
];

buildings.forEach((building, buildingIndex) => {
    buildingUpgradeTypes.forEach((upgradeType, typeIndex) => {
        const cost = Math.floor(building.baseCost * (100 * Math.pow(2, typeIndex)) * upgradeType.costMultiplier);
        upgrades.push({
            name: building.name + " " + upgradeType.suffix,
            description: `x${upgradeType.multiplier} ${building.name} production`,
            type: "building",
            buildingIndex: buildingIndex,
            multiplier: upgradeType.multiplier,
            cost: cost,
            purchased: false
        });
    });
});

const synergyUpgrades = [
    { name: "Grandmother + Farm Synergy", description: "Grandmothers improve farms x1.2", buildings: [0, 1], multiplier: 1.2, cost: 500 },
    { name: "Farm + Orchard Synergy", description: "Farms and Orchards work better together x1.15", buildings: [1, 2], multiplier: 1.15, cost: 5000 },
    { name: "Factory Optimization", description: "All buildings x1.05 more efficient", buildings: [4], multiplier: 1.05, cost: 50000 },
    { name: "Ancient Knowledge", description: "Production +2% per second", type: "passive", value: 0.02, cost: 20000 },
    { name: "Global Distribution", description: "+15% production of all buildings", type: "global", multiplier: 1.15, cost: 100000 },
    { name: "Quantum Entanglement", description: "Building effects stack better x1.1", type: "building", multiplier: 1.1, cost: 500000 },
    { name: "Dimensional Rift", description: "Unlock hidden production", type: "hidden", multiplier: 1.3, cost: 1000000 },
];

synergyUpgrades.forEach((upgrade, i) => {
    upgrades.push({ ...upgrade, purchased: false });
});

const performanceUpgrades = [];
for (let i = 0; i < 50; i++) {
    const tier = Math.floor(i / 10);
    const index = i % 10;
    performanceUpgrades.push({
        name: `Epic Upgrade ${i + 1}`,
        description: `Tier ${tier + 1}: Unlock advanced mechanics`,
        type: "performance",
        multiplier: Math.pow(1.25, tier + 1),
        cost: Math.floor(1e6 * Math.pow(10, tier) * (index + 1)),
        purchased: false
    });
}

performanceUpgrades.forEach(u => upgrades.push(u));

const bonusUpgrades = [];
for (let i = 0; i < 50; i++) {
    bonusUpgrades.push({
        name: `Ascension ${i + 1}`,
        description: `Super rare upgrade - x2 all production`,
        type: "bonus",
        multiplier: 2,
        cost: Math.floor(1e15 * Math.pow(1.5, i)),
        purchased: false
    });
}

bonusUpgrades.forEach(u => upgrades.push(u));

for (let i = 0; i < 20; i++) {
    upgrades.push({
        name: `Transcendence ${i + 1}`,
        description: `Unlock infinite possibilities`,
        type: "transcendence",
        multiplier: Math.pow(3, i + 1),
        cost: Math.floor(1e25 * Math.pow(2, i)),
        purchased: false
    });
}

buildings.forEach((b, i) => b.originalProduction = b.production);

function formatNumber(num) {
    num = Math.floor(num);
    const suffixes = ["", "K", "M", "B", "T", "Q", "Qu", "Sx", "Sp", "O", "N", "D", 
                      "Ud", "Dd", "Td", "Qd", "Quin", "Sex", "Sept", "Oct", "Non", 
                      "Vig", "Unv", "Duv", "Trv", "Qtv", "Qnv", "Sxv", "Spv", "Otv", "Nov",
                      "Trig", "Untrig", "Dutrig", "Trtrig", "Qtrig", "Qntrig", "Sxtrig", "Sptrig", "Otrig", "Notrig",
                      "Quad", "Unquad", "Duquad", "Trquad", "Qtquad", "Qnquad", "Sxquad", "Spquad", "Oquad", "Noquad"];
    
    let suffixIndex = 0;
    while (num >= 1000 && suffixIndex < suffixes.length - 1) {
        num /= 1000;
        suffixIndex++;
    }
    
    return num.toFixed(2).replace(/\.?0+$/, '') + suffixes[suffixIndex];
}

function ClickApple() {
    if (goldenAppleActive) {
        claimGoldenApple();
        return;
    }
    
    currentApple += applePerClick;
    totalApple += applePerClick;

    currentAppleP.textContent = "Current Apple: " + formatNumber(currentApple) + " 🍎";
    totalAppleP.textContent = "Total Apple: " + formatNumber(totalApple) + " 🍎";
    
    soundClick.currentTime = 0;
    soundClick.play();
}

function spawnGoldenApple() {
    goldenAppleActive = true;
    goldenAppleElement.style.display = "block";
}

function claimGoldenApple() {
    goldenAppleActive = false;
    goldenAppleElement.style.display = "none";
    
    const bonusType = Math.random() < 0.5;
    
    if (bonusType) {
        const multiplier = 2 + Math.random() * 2;
        const bonusApples = totalApple * multiplier;
        currentApple += bonusApples;
        totalApple += bonusApples;
        
        showBonusText(`+${formatNumber(bonusApples)} 🍎 BONUS!`);
    } else {
        const oldMultiplier = productionMultiplier;
        productionMultiplier = 500;
        
        showBonusText(`Production x500 for 1 minute!`);
        
        remainingTime = 60;
        startTimer(oldMultiplier);
    }
    
    updateUI();
}

function showBonusText(text) {
    bonusTextP.textContent = text;
    if (bonusTextTimeout) clearTimeout(bonusTextTimeout);
    bonusTextTimeout = setTimeout(() => {
        bonusTextP.textContent = "";
    }, 3000);
}

function startTimer(oldMultiplier) {
    timerDisplayP.style.display = "block";
    updateTimerDisplay();
    
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        remainingTime--;
        updateTimerDisplay();
        
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            productionMultiplier = oldMultiplier;
            timerDisplayP.style.display = "none";
            showBonusText(`Production multiplier expired`);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timerDisplayP.textContent = `⏱️ Production boost: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getActualCost(building) {
    return Math.floor(building.baseCost * Math.pow(1.15, building.owned));
}

function buyBuilding(index) {
    const building = buildings[index];
    const cost = getActualCost(building);
    
    if (currentApple >= cost) {
        currentApple -= cost;
        building.owned++;
        productionPerSecond += building.production;
        updateUI();
    }
}

function buyUpgrade(index) {
    const upgrade = upgrades[index];
    
    if (currentApple >= upgrade.cost && !upgrade.purchased) {
        currentApple -= upgrade.cost;
        upgrade.purchased = true;
        
        if (upgrade.type === "click") {
            applePerClick += upgrade.value;
        } else if (upgrade.type === "building") {
            buildings[upgrade.buildingIndex].production *= upgrade.multiplier;
            recalculateProduction();
        } else if (upgrade.type === "global") {
            buildings.forEach(b => b.production *= upgrade.multiplier);
            recalculateProduction();
        } else if (upgrade.type === "performance" || upgrade.type === "bonus" || upgrade.type === "transcendence") {
            buildings.forEach(b => b.production *= upgrade.multiplier);
            recalculateProduction();
        } else if (upgrade.type === "passive") {
            productionPerSecond *= (1 + upgrade.value);
        }
        
        updateUI();
    }
}

function recalculateProduction() {
    productionPerSecond = 0;
    buildings.forEach(b => {
        productionPerSecond += b.production * b.owned;
    });
}

function updateUI() {
    currentAppleP.textContent = "Current Apple: " + formatNumber(currentApple) + " 🍎";
    totalAppleP.textContent = "Total Apple: " + formatNumber(totalApple) + " 🍎";
    
    buildingsScrollBox.innerHTML = "";
    buildings.forEach((building, index) => {
        const cost = getActualCost(building);
        const canBuy = currentApple >= cost;
        const div = document.createElement("div");
        div.className = "building-item" + (canBuy ? "" : " disabled");
        div.onclick = () => buyBuilding(index);
        div.innerHTML = `
            <p class="item-name">${building.name}</p>
            <p class="item-description">${building.description}</p>
            <p class="item-description">Produces: ${building.production} 🍎/s</p>
            <p class="item-cost">Cost: ${formatNumber(cost)} 🍎</p>
            <p class="item-owned">Owned: ${building.owned}</p>
        `;
        buildingsScrollBox.appendChild(div);
    });
    
    upgradesScrollBox.innerHTML = "";
    upgrades.forEach((upgrade, index) => {
        const canBuy = currentApple >= upgrade.cost && !upgrade.purchased;
        const div = document.createElement("div");
        div.className = "upgrade-item" + (upgrade.purchased ? " purchased" : (canBuy ? "" : " disabled"));
        div.onclick = () => buyUpgrade(index);
        
        let description = upgrade.description;
        
        div.innerHTML = `
            <p class="item-name">${upgrade.name}</p>
            <p class="item-description">${description}</p>
            <p class="item-cost">${upgrade.purchased ? "✓ Purchased" : "Cost: " + formatNumber(upgrade.cost) + " 🍎"}</p>
        `;
        upgradesScrollBox.appendChild(div);
    });
}

setInterval(() => {
    if (productionPerSecond > 0) {
        const production = (productionPerSecond / 10) * productionMultiplier;
        currentApple += production;
        totalApple += production;
        currentAppleP.textContent = "Current Apple: " + formatNumber(currentApple) + " 🍎";
        totalAppleP.textContent = "Total Apple: " + formatNumber(totalApple) + " 🍎";
    }
}, 100);

function scheduleGoldenApple() {
    const delayMs = (5 + Math.random() * 5) * 60 * 1000;
    setTimeout(() => {
        if (!goldenAppleActive) {
            spawnGoldenApple();
        }
        scheduleGoldenApple();
    }, delayMs);
}

scheduleGoldenApple();

updateUI();

function exportSave() {
    const saveData = {
        currentApple,
        totalApple,
        applePerClick,
        productionPerSecond,
        productionMultiplier,
        buildings: buildings.map(b => ({
            name: b.name,
            owned: b.owned,
            production: b.production,
            baseCost: b.baseCost,
            originalProduction: b.originalProduction
        })),
        upgrades: upgrades.map(u => ({
            name: u.name,
            purchased: u.purchased,
            type: u.type
        }))
    };
    
    const json = JSON.stringify(saveData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AppleClicker_Save_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importSave() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const saveData = JSON.parse(event.target.result);
                
                currentApple = saveData.currentApple || 0;
                totalApple = saveData.totalApple || 0;
                applePerClick = saveData.applePerClick || 1;
                productionPerSecond = saveData.productionPerSecond || 0;
                productionMultiplier = saveData.productionMultiplier || 1;
                
                if (saveData.buildings) {
                    saveData.buildings.forEach((savedBuilding, index) => {
                        if (buildings[index]) {
                            buildings[index].owned = savedBuilding.owned || 0;
                            buildings[index].production = savedBuilding.production || buildings[index].originalProduction;
                        }
                    });
                }
                
                if (saveData.upgrades) {
                    saveData.upgrades.forEach((savedUpgrade, index) => {
                        if (upgrades[index]) {
                            upgrades[index].purchased = savedUpgrade.purchased || false;
                        }
                    });
                }
                
                updateUI();
                showBonusText('save loaded ! 📂');
            } catch (error) {
                showBonusText('Error : invalid file ❌');
                console.error('Error in loading:', error);
            }
        };
        reader.readAsText(file);
    };
}

window.addEventListener('load', () => {
    const savedResourcepack = localStorage.getItem("customResourcepack");
    if (savedResourcepack) {
        try {
            currentResourcepack = JSON.parse(savedResourcepack);
            applyResourcepack();
        } catch (error) {
            console.error('Error loading saved resourcepack:', error);
            loadDefaultResourcepack();
        }
    }
});