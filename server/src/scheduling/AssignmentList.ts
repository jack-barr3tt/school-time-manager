export class AssignmentList<T extends { id?: number }> {
    private data: { data: T; next: number; prev: number; index: number; }[];
    private nextIndex: number = 0;
    private count;

    constructor(data: T[]) {
        this.data = data.map((d, i) => ({ data: d, next: i + 1, prev: i - 1, index: i }));
        this.count = this.data.length;
    }

    toArray() {
        return this.data.filter(d => this.data[d.next] && this.data[d.next].prev === d.index).map(d => d.data);
    }

    private removeItem(id: number) {
        const index = this.data.findIndex(d => d.data.id === id);
        if (index === -1) {
            return;
        }
        let nextIndex = this.data[index].next;
        let prevIndex = this.data[index].prev;

        if (this.data[nextIndex])
            this.data[nextIndex].prev = prevIndex;
        if (this.data[prevIndex])
            this.data[prevIndex].next = nextIndex;

        this.count -= 1;
    }

    public remove(id: number|number[]) {
        if(Array.isArray(id))
            id.forEach(i => this.removeItem(i))
        else
            this.removeItem(id)
    }

    rewind() {
        if (this.count > 0) {
            this.nextIndex = this.data.findIndex((d, i) => d.prev === -1 && this.data[d.next] && this.data[d.next].prev === i);
        }
    }

    next() {
        if (this.count < 1)
            return null;

        const next = this.data[this.nextIndex];
        if (!next)
            return null;

        this.nextIndex = next.next;

        return next.data;
    }

    filter(fn: (data: T) => boolean) {
        return this.data.filter((d, i) => fn(d.data) && this.data[d.next] && this.data[d.next].prev === i).map(d => d.data);
    }
}
