const qaData = require('../services/qaData.json');

export function fetchQAData() {
    return qaData.data;
}

export function fetchQAItem(itemId) {
    for (let i = 0; i < qaData.data.length; i++) {
        if (qaData.data[i].id.localeCompare(itemId) === 0) {
            return qaData.data[i];
        }
    }
}

export function fetchQuestionList(itemId) {
    return fetchQAItem(itemId).questionList;
}

export async function saveQuestionListInQAItem(itemId, questionList) {
    let modifiedData = qaData;
    for (let i = 0; i < modifiedData.data.length; i++) {
        if (modifiedData.data[i].id.localeCompare(itemId) === 0) {
            modifiedData.data[i].questionList = questionList;
            const jsonString = JSON.stringify(modifiedData);

            await downloadFile(jsonString);

            return;
        }
    }
}

const downloadFile = async (data) => {
    const fileName = "data";
    const blob = new Blob([data],{type:'application/json'});
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}