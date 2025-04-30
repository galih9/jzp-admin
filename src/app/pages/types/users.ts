export interface IUsersData extends IUser {
    fullName: string;
    dob: string;
    exp: number;
    status: string;
    type: string;
}

export interface IFeedback {
    email: string;
    title: string;
    description: string;
}

export interface IUser {
    name: string;
    email: string;
    level: number;
}