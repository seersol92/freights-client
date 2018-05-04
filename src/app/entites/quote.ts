export class Quote {
    named_vessel: string;
    itinerary_required: string;
    pricing: string;
    units: string;
    required_validity_date: string;
    required_validity_time: string;
    price_request: boolean;
    quote_comments: string;
    user_id: any;
    constructor() {
        this.named_vessel = '';
        this.itinerary_required = '';
        this.pricing = '';
        this.units = '';
        this.required_validity_date = '';
        this.required_validity_time = '';
        this.price_request = true;
        this.user_id = '';
        this.quote_comments = '';
    }
}
