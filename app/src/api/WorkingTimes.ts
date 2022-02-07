const getComponents = (date: Date) => {
    const main = (""+date).split(".")[0]
    return main.split(":").map(r => parseInt(r))    
}

export default class WorkingTime {
    readonly _id: number;
    readonly start_time: Date;
    readonly end_time: Date;

    constructor(data: WorkingTime) {
        this._id = data._id
        this.start_time = new Date(0,0,0, ...getComponents(data.start_time))
        this.end_time = new Date(new Date(0,0,0, ...getComponents(data.end_time)))
    }
}