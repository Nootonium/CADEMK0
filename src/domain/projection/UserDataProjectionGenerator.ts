interface UserContext {
    user: { username: string };
    role: string;
}

class UserDataProjectionGenerator {
    private projectionMap = {
        common: ["username", "profilePictureKey"],
        user: ["username", "firstName", "lastName", "profilePictureKey", "createdAt"],
        privileged: [
            "username",
            "email",
            "firstName",
            "lastName",
            "phoneNumber",
            "profilePictureKey",
            "createdAt",
            "updatedAt",
        ],
    };

    constructor(private context: UserContext, private requestedUsername: string) {}

    private determineAccessLevel(): "common" | "user" | "privileged" {
        const isSelfRequest =
            this.context.user && this.context.user.username === this.requestedUsername;
        const isAdmin = this.context.role === "admin";
        if (isSelfRequest || isAdmin) {
            return "privileged";
        }
        if (this.context.user) {
            return "user";
        }
        return "common";
    }

    generateProjection(): string {
        const accessLevel = this.determineAccessLevel();
        const fields = this.projectionMap[accessLevel];
        return fields.join(" ");
    }
}
export default UserDataProjectionGenerator;
