import express from "express";


export function startHttpServer() {
    const app = express();
    app.use(express.json());
    app.use('/static', express.static('data'));
    if (process.env.NODE_ENV === "production") {
        app.use(express.static("../dist"));
    }
    
    app.post("/api/token", async (req, res) => {
        const response = await fetch(`https://discord.com/api/oauth2/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: process.env.VITE_DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: req.body.code,
            }),
        });

        const {access_token} = await response.json();
        res.send({access_token});
    });
    
    return app;
}