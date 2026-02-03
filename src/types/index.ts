export interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string; // ISO String
}

import 'next-auth';

declare module 'next-auth' {
    interface User {
        id?: string;
    }
    interface Session {
        user: {
            id?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}
