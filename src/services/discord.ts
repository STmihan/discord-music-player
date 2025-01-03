import {DiscordSDK} from "@discord/embedded-app-sdk";


export async function setupDiscordSDK() {
    const clientId = "1314351876489220136";
    const discordSDK = new DiscordSDK(clientId);
    if (discordSDK == null) {
        throw new Error("Discord SDK is null");
    }
    await discordSDK.ready();
    console.log('Discord SDK is ready');

    const {code} = await discordSDK.commands.authorize({
        client_id: clientId,
        response_type: "code",
        state: "",
        prompt: "none",
        scope: [
            "identify",
            "guilds",
            "applications.commands"
        ],
    });

    console.log(`Got code: ${code}`);

    // Retrieve an access_token from your activity's server
    // Note: We need to prefix our backend `/api/token` route with `/.proxy` to stay compliant with the CSP.
    // Read more about constructing a full URL and using external resources at
    // https://discord.com/developers/docs/activities/development-guides#construct-a-full-url
    const response = await fetch("/.proxy/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            code,
        }),
    });
    console.log("Sent token request");
    const {access_token} = await response.json();
    console.log(`access_token: ${access_token}`)
    // Authenticate with Discord client (using the access_token)
    const auth = await discordSDK.commands.authenticate({
        access_token,
    });
    if (auth == null) {
        throw new Error("Authenticate command failed");
    }

    return {discordSDK, auth};
}
