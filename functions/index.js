const functions = require("firebase-functions");
const app = require("express")();
const auth = require("./utils/auth");

const {
    getAllCases,
    getCaseWithId,
    getAnswersInQAItem
} = require("./api/qa-data");

app.get('/imported-data', getAllCases);
app.get('/case/:caseId', getCaseWithId);
app.get('/case/:caseId/:qaItemId', getAnswersInQAItem);

exports.api = functions.https.onRequest(app);