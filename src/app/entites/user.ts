export class User {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    is_admin: boolean;
    password: string;
    user_id: string;
    constructor() {
        this.firstname = '';
        this.lastname = '';
        this.username = '';
        this.email = '';
        this.is_admin = false;
        this.password = '';
        this.user_id = '';
    }
}
