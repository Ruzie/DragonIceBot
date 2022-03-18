export default class ExtraCollection extends Map {
    map(func: Function) {
        const arr = [];
        for (const item of this.values()) {
            arr.push(func(item));
        }
        return arr;
    }
}
