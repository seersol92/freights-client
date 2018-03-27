export class Discharge {
    receiver: string;
    port: string;
    discharge_terminal: string;
    cargo_grade: string;
    api: string;
    volume: string;
    date1: string;
    date2: string;
    window_1: string;
    days_before_1: string;
    window_2: string;
    days_before_2: string;
    comments: string;
    volume_tolerance: string;
    discharge_tolerance: string;
    constructor() {
        this.receiver = '';
        this.port = '';
        this.discharge_terminal = '';
        this.cargo_grade = '';
        this.api = '';
        this.volume = '';
        this.date1 = '';
        this.date2 = '';
        this.window_1 = '';
        this.days_before_1 = '';
        this.window_2 = '';
        this.days_before_2 = '';
        this.comments = '';
        this.volume_tolerance = '';
        this.discharge_tolerance = '';
    }
}