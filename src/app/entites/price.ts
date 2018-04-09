export class Price {
    price: string;
    date: string;
    time: string;
    comments: string;
    quoted_by: any;
    status: string;
    constructor() {
        this.price = '';
        this.date = '';
        this.time = '';
        this.comments = '';
        this.quoted_by = '';
        this.status = 'pending';
    }
}
