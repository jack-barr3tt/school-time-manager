export default class WorkingTime {
    readonly _id: number;
    readonly start_time: Date;
    readonly end_time: Date;

    constructor(data: WorkingTime) {
        this._id = data._id
        this.start_time = data.start_time
        this.end_time = data.end_time
    }
}