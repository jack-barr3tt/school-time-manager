export class Bin<T extends { duration: number; }> {
    private data: T[] = [];
    private maxSize: number;

    constructor(maxSize: number) {
        this.maxSize = maxSize;
    }

    getSpaceUsed(extraItem?: T) {
        if (extraItem)
            return [...this.data, extraItem].reduce((a, b) => a + b.duration, 0);

        else
            return this.data.reduce((a, b) => a + b.duration, 0);
    }

    add(item: T) {
        if (this.getSpaceUsed(item) < this.maxSize) {
            this.data.push(item);
        } else {
            throw new Error("Bin full");
        }
    }

    toArray() {
        return this.data;
    }
}
