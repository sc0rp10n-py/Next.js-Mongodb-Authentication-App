// import { session, promisifyStore, Store, MemoryStore } from "next-session";
import nextSession from "next-session";
import { promisifyStore } from "next-session/lib/compat";
// import connectMongo from "connect-mongo";

// const MongoStore = connectMongo({ Store, MemoryStore });
const MongoStore = require("connect-mongo");

// export default function (req, res, next) {
//     const mongoStore = new MongoStore({
//         client: req.dbClient,
//         stringify: false,
//     });
//     return session({
//         store: promisifyStore(mongoStore),
//     })(req, res, next);
// }

export default function (req, res, next) {
    const mongoStore = MongoStore.create({
        client: req.dbClient,
        stringify: false,
    });
    return nextSession({
        store: promisifyStore(mongoStore),
    })(req, res, next);
}
