import nextConnect from "next-connect";
import isEmail from "validator/lib/isEmail";
import normalizeEmail from "validator/lib/normalizeEmail";
import bcrypt from "bcryptjs";
import middleware from "../../middlewares/middleware";
import { extractUser } from "../../lib/api-helpers";

const handler = nextConnect();
console.log("8");
handler.use(middleware); // see how we're reusing our middleware
console.log("9");
// POST /api/users
handler.post(async (req, res) => {
    console.log("1");
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email); // this is to handle things like jane.doe@gmail.com and janedoe@gmail.com being the same
    console.log("2");
    if (!isEmail(email)) {
        res.status(400).send("The email you entered is invalid.");
        return;
    }
    console.log("3");
    if (!password || !name) {
        res.status(400).send("Missing field(s)");
        return;
    }
    console.log("4");
    // check if email existed
    if ((await req.db.collection("users").countDocuments({ email })) > 0) {
        res.status(403).send("The email has already been used.");
    }
    console.log("5");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("6");
    const user = await req.db
        .collection("users")
        .insertOne({ email, password: hashedPassword, name })
        .then(({ ops }) => ops[0]);
    console.log("7");
    req.logIn(user, (err) => {
        if (err) throw err;
        // when we finally log in, return the (filtered) user object
        res.status(201).json({
            user: extractUser(req),
        });
    });
});

export default handler;