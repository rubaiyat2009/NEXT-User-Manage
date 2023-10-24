/// <reference types="lucia" />

declare namespace Lucia {
    export type Auth = import('@/app/_models/User').Auth;
}

declare namespace Abilities {
    export type User = import('@/app/_models/User').IUser;

    export type Actions = 'create' | 'read' | 'update' | 'delete' | 'supervise' | 'manage';

    export interface SubjectMapping {}

    export type Subjects = {
        [K in keyof SubjectMapping]: SubjectMapping[K] | K;
    }[keyof SubjectMapping];
}

declare module 'html2pdf.js';
