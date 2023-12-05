import express, { Application } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import cors from "cors";
import { mongooseConnect } from "./database";
import { dashboardCustomers, dashboardLogin, dashboardLogout, dashboardNotifications, dashboardUsers } from "./constants/app_routes/dashboard";
import { adminCenterUsers, adminCenters } from "./constants/app_routes/admin";


const cors_options = {
    origin: "*",
    methods: ["GET", "POST"]
}

export class App {
    private app: Application;
    private httpServer: any;
    public io: Server;

    constructor(private port?: number | string) {
        this.app = express();
        this.httpServer = createServer(this.app);

        this.io = new Server(this.httpServer, {
            cors: cors_options
        });

        this.settings();
        this.middlewares();
        this.routes();
    }

    settings() {
        this.app.set("port", this.port || process.env.PORT || 3000);
        this.app.use(bodyParser.json({ limit: "50mb" }));
        this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    }

    middlewares() {
        this.app.use(cors(cors_options));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use("/storage", express.static("../storage"));
    }

    routes() {
        // admin routes
        this.app.use("/api/web/admin/centers", adminCenters);
        this.app.use("/api/web/admin/centerUsers", adminCenterUsers);


        // dashboard routes
        this.app.use("/api/web/login", dashboardLogin);
        this.app.use("/api/web/logout", dashboardLogout);
        this.app.use("/api/web/customers", dashboardCustomers);
        this.app.use("/api/web/users", dashboardUsers);
        this.app.use("/api/web/notifications", dashboardNotifications);


        // if route not found
        this.app.use("*", (req, res) => {
            res.status(404).json({
                error: true,
                message: "Route not found",
            });
        });
    }

    async listen() {
        await this.httpServer.listen(this.app.get("port"));
        await mongooseConnect();

        console.log(`Server on port localhost:${this.app.get("port")}`);
    }
}