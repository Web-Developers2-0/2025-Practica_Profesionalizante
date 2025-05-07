export interface User {
    id: number;
    email?: string;
    first_name?: string;
    last_name?: string;
    address: string;
    phone: string;
    password: string;
    confirmPassword: string;
    image?: string; 

}