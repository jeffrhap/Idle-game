const pickLoot = (list) => {
    if (list.length === 0) return null;

    let i, v;
    let totalWeight = 0;
    for (i = 0; i < list.length; i++) {
        v = list[i];
        if (v.amount > 0) {
            totalWeight += v.chance;
        }
    }

    const randomNumber = Math.floor(Math.random() * totalWeight + 1);
    let choice = 0;
    let weight = 0;

    for (i = 0; i < list.length; i++) {
        v = list[i];

        if (v.amount <= 0) continue;
        weight += v.chance;

        if (randomNumber <= weight) {
            choice = i;
            break;
        }
    }

    return list[choice];;
}

export { pickLoot };