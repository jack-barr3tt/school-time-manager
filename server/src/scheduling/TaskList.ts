import Activity from "../database/activities";

export class TaskList {
    private data: { data: Activity; next: number; }[];
    private nextIndex: number = 0;

    public get length() {
        return this.data.length;
    }

    constructor(data?: Activity[]) {
        if(data) this.data = data.map((d, i) => ({ data: d, next: i + 1 }));
        else this.data = []
    }

    shuffle() {
        let last = 0;
        let visited: number[] = [];
        while (true) {
            if (!this.data[last])
                break;

            let loopback = -1;

            for (let i = 0; i < this.data.length; i++) {
                if (!visited.includes(i) && i !== last) {
                    loopback = i;
                    if (this.data[i].data.homework.subject_id === this.data[last].data.homework.subject_id) {
                        break;
                    }
                }
            }

            if (loopback == -1) {
                this.data[last].next = loopback;
                break;
            }

            let found = false;

            for (let i = 0; i < this.data.length; i++) {
                if (!visited.includes(i) && i != loopback) {
                    if (this.data[i].data.homework.subject_id != this.data[last].data.homework.subject_id) {
                        this.data[last].next = i;
                        this.data[i].next = loopback;
                        visited.push(i);
                        found = true;
                        break;
                    }
                }
            }

            if (!found) {
                this.data[last].next = loopback;
            }
            visited.push(last);
            last = loopback;
        }
    }

    next() {
        let currentItem = this.data[this.nextIndex];
        if (!currentItem)
            return null;
        this.nextIndex = currentItem.next;
        return currentItem.data;
    }

    add(item: Activity|Activity[]) {
        if(Array.isArray(item))
            this.data.push(...item.map(i => ({data: i, next: this.data.length})))
        else
            this.data.push({ data: item, next: this.data.length });
    }

    filter(fn: (data: Activity) => boolean) {
        return this.data.filter(d => fn(d.data)).map(d => d.data);
    }

    rewind() {
        this.nextIndex = 0;
    }
}
