export interface AuthorizationOptions {
    hasRole: Array<"admin" | "user">;
    allowSameUser?: boolean;
}