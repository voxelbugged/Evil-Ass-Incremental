let bones = 0;
let bonesIncreaseRate = 1;
let buyMax = false;

const items = {
    tombstone: { amount: 0, price: 10, priceMultiplier: 1.5 },
    graveyard: { amount: 0, price: 250, priceMultiplier: 1.5 },
    building: { amount: 0, price: 2500, priceMultiplier: 1.5 },
    gizmo: { amount: 0, price: 100, priceMultiplier: 10 },
    evil: { amount: 0, price: 666, priceMultiplier: 10 }
};

function evil() {
    bones += bonesIncreaseRate;
    updateCounters();
}

function format(num) {
    return num.toPrecision(3).replace("+", "");
}

function buy(thing) {
    const item = items[thing];
    if(!item) return;
    while(bones >= item.price)
    {
        bones -= item.price;
        item.amount++;
        item.price *= item.priceMultiplier;
        updateBonesIncreaseRate();
        updateCounters();
        updateInfobox();
        if(thing === "evil")
        {
            updateEvil();
        }
        if(!buyMax) return;
    }
}

function updateBonesIncreaseRate() {
    const t = items.tombstone.amount;
    const g = items.graveyard.amount;
    const b = items.building.amount;
    const e = items.evil.amount;

    bonesIncreaseRate = (((1 + t) * (1 + g / 4)) ** (1 + b / 40)) * (2 ** e);
}

function updateCounters() {
    if(document.visibilityState === "visible") {
        document.getElementById("bones-counter").innerHTML = format(bones);
        document.getElementById("bones-per-click").innerHTML = format(bonesIncreaseRate);
        document.getElementById("bones-per-second").innerHTML = format(bonesIncreaseRate * items.gizmo.amount);
    
        for (const [name, item] of Object.entries(items)) {
            document.getElementById(`${name}-price`).innerHTML = format(item.price);
            document.getElementById(`${name}-amount`).innerHTML = item.amount;
        }
        
        updateUpgrades();
        // temporary ending
        if(items.evil.amount >= 65){
            document.getElementById("bones-counter").innerHTML = "congrulation you have beated the game!!!";
        }
    }
}

function updateUpgrades() {
    for (const [name, item] of Object.entries(items)) {
        document.getElementById(`buy-${name}`).classList.toggle("purchasable", bones >= item.price);
    }
}
function updateInfobox() {
    document.getElementById("base").innerHTML = format(1 + items.tombstone.amount);
    document.getElementById("multiplier").innerHTML = format(1 + (items.graveyard.amount * 0.25));
    document.getElementById("exponent").innerHTML = format(1 + items.building.amount * 0.025);
    document.getElementById("autoclick").innerHTML = format(items.gizmo.amount);
    document.getElementById("evil-multiplier").innerHTML = format(2**items.evil.amount);
}

function updateEvil()
{
    // Logos and such
    document.getElementById("good-logo").classList.toggle("hidden", items.evil.amount >= 30);
    document.getElementById("good-logo").classList.toggle("fontful", items.evil.amount >= 10);
    document.getElementById("evil-logo").classList.toggle("hidden", items.evil.amount < 30);
}

function gameTick() {
    const visible = document.visibilityState === "visible";
    const bonus = visible ? 0.1 : 1;
    bones += bonesIncreaseRate * items.gizmo.amount * bonus;

    updateCounters();

    if(items.evil.amount < 30) {
        document.title = `${format(bones)} bones - Evil Ass Incremental`;
    }
    else {
        document.title = `${format(bones)} bones — 𝕰𝖛𝖎𝖑 𝕬𝖘𝖘 𝕴𝖓𝖈𝖗𝖊𝖒𝖊𝖓𝖙𝖆𝖑`;
    }
}

function save() {
    const saveData = {
        bones,
        bonesIncreaseRate,
        items
    };
    localStorage.setItem("evilIncrementalSave", JSON.stringify(saveData));
}

function load() {
    const savedData = localStorage.getItem("evilIncrementalSave");
    if (savedData) {
        const parsed = JSON.parse(savedData);
        bones = parsed.bones ?? 0;
        bonesIncreaseRate = parsed.bonesIncreaseRate ?? 1;

        for (const key in items) {
            if (parsed.items[key]) {
                items[key].amount = parsed.items[key].amount ?? 0;
                items[key].price = parsed.items[key].price ?? items[key].price;
                items[key].priceMultiplier = parsed.items[key].priceMultiplier ?? items[key].priceMultiplier;
            }
        }
    }
}

function reset() {
    if(confirm("Are you sure you want to reset the game? You will lose all of your Evil Ass Progress!"))
    {   
        localStorage.removeItem("evilIncrementalSave");
        location.reload();
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Shift') {
        buyMax = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'Shift') {
        buyMax = false;
    }
});

setInterval(gameTick, 100);
setInterval(save, 5000);

load();
updateBonesIncreaseRate();
updateCounters();
updateInfobox();
updateEvil();