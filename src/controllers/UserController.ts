import { Controller, Get, Route, Tags } from "tsoa";

@Route("auth")
@Tags("Authentication")
export class UserController extends Controller {
    @Get('health')
    public async healthCheck(): Promise<{ status: string }> {
        return { status: "ok" };
    }
}