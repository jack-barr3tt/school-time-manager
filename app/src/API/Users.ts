import axios, { AxiosResponse } from "axios";
import HomeworkManager from "./HomeworkManager";
import LessonBlockManager from "./LessonBlockManager";
import LessonManager from "./LessonManager";
import LocationManager from "./LocationManager";
import RepeatManager from "./RepeatManager";
import SubjectManager from "./SubjectManager";
import TeacherManager from "./TeacherManager";
import WorkingTimesManager from "./WorkingTimesManager";

export class User {
    readonly _id: number;
    readonly email : string;
    readonly username : string;
    readonly prewarning? : number;
    readonly subjects : SubjectManager;
    readonly homework : HomeworkManager;
    readonly repeats : RepeatManager;
    readonly workingTimes: WorkingTimesManager;
    readonly lessonBlocks: LessonBlockManager;
    readonly locations: LocationManager;
    readonly teachers: TeacherManager;
    readonly lessons: LessonManager;

    constructor(data: User) {
        this._id = data._id
        this.email = data.email
        this.username = data.username
        this.prewarning = data.prewarning
        this.subjects = new SubjectManager(this._id)
        this.homework = new HomeworkManager(this._id)
        this.repeats = new RepeatManager(this._id)
        this.workingTimes = new WorkingTimesManager(this._id)
        this.lessonBlocks = new LessonBlockManager(this._id)
        this.locations = new LocationManager(this._id)
        this.teachers = new TeacherManager(this._id)
        this.lessons = new LessonManager(this._id)
    }

    static forge(id: number) {
        return { 
            _id: id, 
            subjects: new SubjectManager(id),
            homework: new HomeworkManager(id),
            repeats: new RepeatManager(id),
            workingTimes: new WorkingTimesManager(id),
            lessonBlocks: new LessonBlockManager(id),
            locations: new LocationManager(id),
            teachers: new TeacherManager(id),
            lessons: new LessonManager(id)
        } as Partial<User>
    }

    static async get(id: number) {
        const { data } = await axios.get(`http://localhost:3000/users/${id}`) as AxiosResponse<User>
        return new User(data)
    }

    async setPreWarning(prewarning: number) {
        await axios.patch(`http://localhost:3000/users/${this._id}`, { prewarning })
    }
}