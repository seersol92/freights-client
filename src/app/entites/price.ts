export class Price {
    price: string;
    date: string;
    time: string;
    comments: string;
    quoted_by: any;
    is_active: boolean;
    constructor() {
        this.price = '';
        this.date = '';
        this.time = '';
        this.comments = '';
        this.quoted_by = '';
        this.is_active = true;
    }
}
