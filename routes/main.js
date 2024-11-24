const express = require("express");
const functions = require("../structs/functions.js");
const fs = require("fs");
const app = express.Router();
const log = require("../structs/log.js");
const path = require("path");
const { getAccountIdData, addEliminationHypePoints, addVictoryHypePoints, deductBusFareHypePoints } = require("./../structs/functions.js");
const { verifyToken, verifyClient } = require("../tokenManager/tokenVerify.js");
const User = require("../model/user.js");
const Arena = require("../model/arena.js");
const config = JSON.parse(fs.readFileSync("./Config/config.json").toString());


app.post("/fortnite/api/game/v2/chat/*/*/*/pc", (req, res) => {
    log.debug("POST /fortnite/api/game/v2/chat/*/*/*/pc called");
    let resp = config.chat.EnableGlobalChat ? { "GlobalChatRooms": [{ "roomName": "reloadbackendglobal" }] } : {};

    res.json(resp);
});

app.post("/fortnite/api/game/v2/tryPlayOnPlatform/account/*", (req, res) => {
    log.debug("POST /fortnite/api/game/v2/tryPlayOnPlatform/account/* called");
    res.setHeader("Content-Type", "text/plain");
    res.send(true);
});

app.get("/launcher/api/public/distributionpoints/", (req, res) => {
    log.debug("GET /launcher/api/public/distributionpoints/ called");
    res.json({
        "distributions": [
            "https://download.epicgames.com/",
            "https://download2.epicgames.com/",
            "https://download3.epicgames.com/",
            "https://download4.epicgames.com/",
            "https://epicgames-download1.akamaized.net/"
        ]
    });
});

app.get("/launcher/api/public/assets/*", async (req, res) => {
    res.json({
        "appName": "FortniteContentBuilds",
        "labelName": "ReloadBackend",
        "buildVersion": "++Fortnite+Release-20.00-CL-19458861-Windows",
        "catalogItemId": "5cb97847cee34581afdbc445400e2f77",
        "expires": "9999-12-31T23:59:59.999Z",
        "items": {
            "MANIFEST": {
                "signature": "ReloadBackend",
                "distribution": "https://reloadbackend.ol.epicgames.com/",
                "path": "Builds/Fortnite/Content/CloudDir/ReloadBackend.manifest",
                "hash": "55bb954f5596cadbe03693e1c06ca73368d427f3",
                "additionalDistributions": []
            },
            "CHUNKS": {
                "signature": "ReloadBackend",
                "distribution": "https://reloadbackend.ol.epicgames.com/",
                "path": "Builds/Fortnite/Content/CloudDir/ReloadBackend.manifest",
                "additionalDistributions": []
            }
        },
        "assetId": "FortniteContentBuilds"
    });
})

app.get("/Builds/Fortnite/Content/CloudDir/*.manifest", async (req, res) => {
    res.set("Content-Type", "application/octet-stream")

    const manifest = fs.readFileSync(path.join(__dirname, "..", "responses", "CloudDir", "ReloadBackend.manifest"));

    res.status(200).send(manifest).end();
})

app.get("/Builds/Fortnite/Content/CloudDir/*.chunk", async (req, res) => {
    res.set("Content-Type", "application/octet-stream")

    const chunk = fs.readFileSync(path.join(__dirname, "..", "responses", "CloudDir", "ReloadBackend.chunk"));

    res.status(200).send(chunk).end();
})

app.post("/fortnite/api/game/v2/grant_access/*", async (req, res) => {
    log.debug("POST /fortnite/api/game/v2/grant_access/* called");
    res.json({});
    res.status(204);
})

app.post("/api/v1/user/setting", async (req, res) => {
    log.debug("POST /api/v1/user/setting called");
    res.json([]);
})

app.get("/Builds/Fortnite/Content/CloudDir/*.ini", async (req, res) => {
    const ini = fs.readFileSync(path.join(__dirname, "..", "responses", "CloudDir", "Full.ini"));

    res.status(200).send(ini).end();
})

app.get("/waitingroom/api/waitingroom", (req, res) => {
    log.debug("GET /waitingroom/api/waitingroom called");
    res.status(204);
    res.end();
}); 

app.get("/socialban/api/public/v1/*", (req, res) => {
    log.debug("GET /socialban/api/public/v1/* called");
    res.json({
        "bans": [],
        "warnings": []
    });
});

app.get("/fortnite/api/game/v2/events/tournamentandhistory/*/EU/WindowsClient", (req, res) => {
    log.debug("GET /fortnite/api/game/v2/events/tournamentandhistory/*/EU/WindowsClient called");
    res.json({});
});

app.get("/fortnite/api/statsv2/account/:accountId", (req, res) => {
    log.debug(`GET /fortnite/api/statsv2/account/${req.params.accountId} called`);
    res.json({
        "startTime": 0,
        "endTime": 0,
        "stats": {},
        "accountId": req.params.accountId
    });
});

app.get("/statsproxy/api/statsv2/account/:accountId", (req, res) => {
    log.debug(`GET /statsproxy/api/statsv2/account/${req.params.accountId} called`);
    res.json({
        "startTime": 0,
        "endTime": 0,
        "stats": {},
        "accountId": req.params.accountId
    });
});

app.get("/fortnite/api/stats/accountId/:accountId/bulk/window/alltime", (req, res) => {
    log.debug(`GET /fortnite/api/stats/accountId/${req.params.accountId}/bulk/window/alltime called`);
    res.json({
        "startTime": 0,
        "endTime": 0,
        "stats": {},
        "accountId": req.params.accountId
    });
});

app.post("/fortnite/api/feedback/*", (req, res) => {
    log.debug("POST /fortnite/api/feedback/* called");
    res.status(200);
    res.end();
});

app.post("/fortnite/api/statsv2/query", (req, res) => {
    log.debug("POST /fortnite/api/statsv2/query called");
    res.json([]);
});

app.post("/statsproxy/api/statsv2/query", (req, res) => {
    log.debug("POST /statsproxy/api/statsv2/query called");
    res.json([]);
});

app.post("/fortnite/api/game/v2/events/v2/setSubgroup/*", (req, res) => {
    log.debug("POST /fortnite/api/game/v2/events/v2/setSubgroup/* called");
    res.status(204);
    res.end();
});

app.get("/fortnite/api/game/v2/enabled_features", (req, res) => {
    log.debug("GET /fortnite/api/game/v2/enabled_features called");
    res.json([]);
});

app.get("/api/v1/events/Fortnite/download/*", async (req, res) => {
    const accountId = req.params.account_id;

    try {
        const playerData = await Arena.findOne({ accountId });
        const hypePoints = playerData ? playerData.hype : 0;
        const division = playerData ? playerData.division : 0;

        const eventsDataPath = path.join(__dirname, "./../responses/eventlistactive.json");
        const events = JSON.parse(fs.readFileSync(eventsDataPath, 'utf-8'));

        events.player = {
            accountId: accountId,
            gameId: "Fortnite",
            persistentScores: {
                Hype: hypePoints
            },
            tokens: [`ARENA_S8_Division${division + 1}`]
        };

        res.json(events);

    } catch (error) {
        console.error("Error fetching Arena data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/fortnite/api/game/v2/twitch/*", (req, res) => {
    log.debug("GET /fortnite/api/game/v2/twitch/* called");
    res.status(200);
    res.end();
});

app.get("/fortnite/api/game/v2/world/info", (req, res) => {
    log.debug("GET /fortnite/api/game/v2/world/info called");
    res.json({});
});

app.post("/fortnite/api/game/v2/chat/*/recommendGeneralChatRooms/pc", (req, res) => {
    log.debug("POST /fortnite/api/game/v2/chat/*/recommendGeneralChatRooms/pc called");
    res.json({});
});

app.get("/presence/api/v1/_/*/last-online", async (req, res) => {
    log.debug("GET /presence/api/v1/_/*/last-online called");
    res.json({})
})

app.get("/fortnite/api/receipts/v1/account/*/receipts", (req, res) => {
    log.debug("GET /fortnite/api/receipts/v1/account/*/receipts called");
    res.json([]);
});

app.get("/fortnite/api/game/v2/leaderboards/cohort/*", (req, res) => {
    log.debug("GET /fortnite/api/game/v2/leaderboards/cohort/* called");
    res.json([]);
});

app.post("/api/v1/assets/Fortnite/*/*", async (req, res) => {
    log.debug("POST /api/v1/assets/Fortnite/*/* called");
    if (req.body.hasOwnProperty("FortCreativeDiscoverySurface") && req.body.FortCreativeDiscoverySurface == 0) {
        const discovery_api_assets = require("./../responses/Discovery/discovery_api_assets.json");
        res.json(discovery_api_assets)
    } else {
        res.json({
            "FortCreativeDiscoverySurface": {
                "meta": {
                    "promotion": req.body.FortCreativeDiscoverySurface || 0
                },
                "assets": {}
            }
        })
    }
})

app.get("/region", async (req, res) => {
    log.debug("GET /region called");
    res.json({
        "continent": {
            "code": "EU",
            "geoname_id": 6255148,
            "names": {
                "de": "Europa",
                "en": "Europe",
                "es": "Europa",
                "it": "Europa",
                "fr": "Europe",
                "ja": "ヨーロッパ",
                "pt-BR": "Europa",
                "ru": "Европа",
                "zh-CN": "欧洲"
            }
        },
        "country": {
            "geoname_id": 2635167,
            "is_in_european_union": false,
            "iso_code": "GB",
            "names": {
                "de": "UK",
                "en": "United Kingdom",
                "es": "RU",
                "it": "Stati Uniti",
                "fr": "Royaume Uni",
                "ja": "英国",
                "pt-BR": "Reino Unido",
                "ru": "Британия",
                "zh-CN": "英国"
            }
        },
        "subdivisions": [
            {
                "geoname_id": 6269131,
                "iso_code": "ENG",
                "names": {
                    "de": "England",
                    "en": "England",
                    "es": "Inglaterra",
                    "it": "Inghilterra",
                    "fr": "Angleterre",
                    "ja": "イングランド",
                    "pt-BR": "Inglaterra",
                    "ru": "Англия",
                    "zh-CN": "英格兰"
                }
            },
            {
                "geoname_id": 3333157,
                "iso_code": "KEC",
                "names": {
                    "en": "Royal Kensington and Chelsea"
                }
            }
        ]
    })
})

app.get("/fortnite/api/game/v2/br-inventory/account/*", async (req, res) => {
    log.debug(`GET /fortnite/api/game/v2/br-inventory/account/${req.params.accountId} called`);
    res.json({
        "stash": {
            "globalcash": 0
        }
    })
})

app.post("/datarouter/api/v1/public/data", async(req, res) => {
    const accountId = getAccountIdData(req.query.UserID);
    const data = req.body.Events;

    if (data && data.length > 0) {
        for (var event of data) {
            if (event.EventName && event.ProviderType) {
                if (event.ProviderType == "Client") {
                    const findUser = await User.findOne({ "accountId": accountId });
                    var playerKills = Number(event.PlayerKilledPlayerEventCount);
                    
                    // Events from s8 (some can work for other seasons)
                    if (findUser) {
                        switch (event.EventName) {
                            case "Athena.ClientWonMatch": // Win Game
                                await addVictoryHypePoints(findUser);
                                break;
                            case "Combat.AthenaClientEngagement": // PlayerKills

                                for (let i = 0; i < playerKills; i++) { // Add point per elimination
                                    await addEliminationHypePoints(findUser);
                                }
                                break;
                                case "Combat.ClientPlayerDeath":
                                await deductBusFareHypePoints(findUser)
                                    break;
                            default:
                                break;
                        }
                    }
                }
            }
        }
    }

    res.status(204).end();
});

module.exports = app;