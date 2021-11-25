/* eslint-disable no-loop-func */
import { config } from "./../view/viewConfig"
import { getAllDocumentInCollection } from "./firestoreHandler";

export async function buildAnswerList( qaItemId, questionId ) {
    const answerListRef = config.referenceToAnswerList
        .replace( "{qaItemId}", qaItemId )
        .replace( "{questionId}", questionId );

    return await getAllDocumentInCollection( answerListRef );
}

export async function buildQuestionList( qaItemId, loadingCompletedCallback ) {
    const questionListRef = config.referenceToQuestionList
        .replace( "{qaItemId}", qaItemId );

    await getAllDocumentInCollection( questionListRef )
        .then( async ( questionList ) => {
            const questionDataList = [];
            const lastQuestionItem = questionList[ questionList.length - 1 ];

            for await ( const questionItem of questionList ) {
                await buildAnswerList( qaItemId, questionItem.id )
                    .then(
                        ( answerList ) => {
                            const questionData = {
                                id: questionItem.id,
                                data: {
                                    question: questionItem.data.question,
                                    answers: answerList
                                }
                            }

                            questionDataList.push( questionData );

                            if ( questionItem === lastQuestionItem ) {
                                loadingCompletedCallback( questionDataList );
                            }
                        }
                    );
            }
        } )
        .catch( ( error ) => {
            console.log( error );

            return [];
        } );
}

export async function buildQAItemList( progressCallback ) {
    const qaItemListRef = config.referenceToAllQAItem;

    await getAllDocumentInCollection( qaItemListRef )
        .then( async ( qaItemList ) => {
            const qaItemDataList = [];

            // Progress values
            const max = qaItemList.length;
            let current = 0;

            for await ( const qaItem of qaItemList ) {
                await buildQuestionList(
                    qaItem.id,
                    ( questionList ) => {
                        const qaItemData = {
                            image: {
                                imageName: qaItem.data.imageName,
                                imageURL: qaItem.data.imgUrl
                            },
                            questionList: questionList
                        }

                        progressCallback( qaItemData, ++current, max );
                        qaItemDataList.push( qaItemData );
                    }
                )
            }

            return qaItemDataList;
        } )
        .catch( ( error ) => {
            console.log( error );
            return [];
        } );
}