export class Price {
    price: string;
    date: string;
    time: string;
    comments: string;
    new_request: boolean;
    is_admin: any;
    quoted_by: any;
    status: string;
    constructor() {
        this.new_request = true;
        this.price = '';
        this.date = '';
        this.time = '';
        this.comments = '';
        this.quoted_by = '';
        this.is_admin = false;
        this.status = 'pending';
    }
}
