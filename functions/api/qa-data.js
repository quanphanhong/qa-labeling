const {db} = require("../utils/admin");

exports.getAllCases = (request, response) => {
    const dataCollection = db.collection("data");

    dataCollection.get().then((cases) => {
        const dataItems = [];
        cases.forEach((item) => {
            dataItems.push({
                itemId: item.id,
                imgUrl: item.data().imgUrl,
                createdAt: item.data().createdAt,
            });
        });

        return response.json(dataItems);
    })
    .catch((error) => {
        console.error(error);

        return response.status(500).json({ error: error.code});
    });
};

exports.getAnswersInQAItem = (request, response) => {
    const answerCollection =
        db.collection(`data/${request.params.caseId}/questionsList/${request.params.qaItemId}/answersList`);

    answerCollection.get().then((answersList) => {
        const answers = [];

        answersList.forEach((answer) => {
            answers.push({
                answerId: answer.id,
                answer: answer.data().answer,
            });
        });

        return response.json(answers);
    })
    .catch((error) => {
        console.error(error);

        return response.status(500).json({ error: error.code});
    });
}

const getQAInCase = async (caseId) => {
    const qaCollection = db.collection(`data/${caseId}/questionsList`);
    const qaItems = [];

    await qaCollection.get().then((qaList) => {
        qaList.forEach((qaItem) => {
            qaItems.push({
                qaItemId: qaItem.id,
                question: qaItem.data().question,
            });
        });
    })
    .catch((error) => {
        console.error(error);

        return response.status(500).json({ error: error.code});
    });

    return qaItems;
}

exports.getCaseWithId = async (request, response) => {
    let caseItem = [];

    const caseDoc = db.doc(`data/${request.params.caseId}`);
    await caseDoc.get().then(async (doc) => {
        if (!doc.exists) {
            return response.status(404).json(
                {
                    error: "We cannot find any case that match your query!"
                });
        }

        const caseItem = doc.data();
        caseItem.caseId = doc.id;
        caseItem.questions = await getQAInCase(caseItem.caseId);

        return response.json(caseItem);
    })
    .catch((error) => {
        console.error(error);

        return response.status(500).json({ error: error.code});
    });
};