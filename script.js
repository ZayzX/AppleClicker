let currentApple = 0;
let totalApple = 0;
let applePerClick = 1;
let productionPerSecond = 0;
let goldenAppleActive = false;
let productionMultiplier = 1;
let bonusTextTimeout = null;

let currentAppleP = document.getElementById("CurrentApple");
let totalAppleP = document.getElementById("totalApple");
let bonusTextP = document.getElementById("bonusText");
let soundClick = document.getElementById("sound");
let buildingsScrollBox = document.getElementById("buildingsScrollBox");
let upgradesScrollBox = document.getElementById("upgradesScrollBox");
let goldenAppleElement = document.getElementById("goldenApple");

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
        const multiplier = 2 + Math.random() * 2; // 2-4x
        const bonusApples = totalApple * multiplier;
        currentApple += bonusApples;
        totalApple += bonusApples;
        
        showBonusText(`+${formatNumber(bonusApples)} 🍎 BONUS!`);
    } else {
        const oldMultiplier = productionMultiplier;
        productionMultiplier = 500;
        
        showBonusText(`Production x500 for 1 minute!`);
        
        setTimeout(() => {
            productionMultiplier = oldMultiplier;
            showBonusText(`Production multiplier expired`);
        }, 60000);
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