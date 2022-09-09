export class TBCloud {
    static values = new Map();

    static getValue(id: string) {
        return this.values.get(id);
    }
    static setValue(id: string, value: any) {
        this.values.set(id, value);
    }
    static modifyValue(id: string, value: any) {
        let newValue = value + this.getValue(id);

        this.values.set(id, newValue);
    }
}
