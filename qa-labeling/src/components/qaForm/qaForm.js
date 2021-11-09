import React from "react";
import './qaForm.css'

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { fetchQAItem, saveQuestionListInQAItem } from "../../model/dataHandler";

export class QAForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            qaItem: [],
            qaItemId: props.qaItemId,
            noQuestions: 0,
            questionList: [],
            imageUrl: "",
        }

        this.onKeyUp = this.onKeyUp.bind(this);
    }

    componentDidMount() {
        this.updateQAItem();
    }

    updateQAItem() {
        const qaItem = fetchQAItem(this.state.qaItemId);

        this.setState({
            qaItem: qaItem,
            imageUrl: qaItem.imgUrl,
            questionList: qaItem.questionList,
            noQuestions: qaItem.questionList.length,
        });
    }

    render() {

        return (
            <Col className="formContainer">
                {this.buildImagePreview()}
                {this.buildQAForm()}

                <Button
                    className="saveButton"
                    onClick={
                        () => saveQuestionListInQAItem(this.state.qaItemId, this.state.questionList)
                    }>
                    Save
                </Button>
            </Col>
        );
    };

    buildImagePreview() {
        return (
            <TransformWrapper as={Row}>
                <TransformComponent>
                    <img src={this.state.imageUrl} height="100%" alt="PreviewImage"/>
                </TransformComponent>
            </TransformWrapper>
        );
    }

    buildQAForm() {
        return (
            <Form as={Row} className="qaForm">
                    <Row className="mb-3">
                        {this.buildImageForm()}
                        {this.buildQuestionCountForm()}
                    </Row>

                    {this.buildQuestionList()}
                </Form>
        );
    }

    buildImageForm() {
        const updateImageUrl = (event) => {
            this.setState({imageUrl: event.target.value});
        }

        return (
            <Form.Group as={Col} controlId="floatingTextarea">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                    type="url"
                    placeholder="Enter image URL"
                    defaultValue={this.state.imageUrl}
                    onChange={updateImageUrl}
                />
                <Form.Text className="text-muted">
                </Form.Text>
            </Form.Group>
        )
    }

    buildQuestionCountForm() {
        const handleNoQuestionsChanged = (event) => {
            const prevNoQuestions = this.state.noQuestions;
            const currentNoQuestions = event.target.value;
            let currentQuestionList = Object.assign({}, this.state.questionList);

            if (prevNoQuestions < currentNoQuestions) {
                const newQuestion = {
                    question: "",
                    answerList: [],
                };
                currentQuestionList[currentNoQuestions - 1] = newQuestion;
            }
            else if (prevNoQuestions > currentNoQuestions) {
                currentQuestionList.length = currentNoQuestions - 1;
            }

            this.setState({
                noQuestions: currentNoQuestions,
                questionList: currentQuestionList,
            });
        }

        return (
            <Form.Group as={Col} controlId="floatingTextarea">
                <Form.Label>Number of questions</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="Enter number of questions"
                    onChange={handleNoQuestionsChanged}
                />
                <Form.Text className="text-muted">
                </Form.Text>
            </Form.Group>
        );
    }

    buildQuestionList = () => {
        var questions = [];
        const qList = this.state.questionList;

        for (let i = 0; i < this.state.noQuestions; i++) {
            questions.push(
                <div className="mb-3" key={"question " + i}>
                    <Form.Group className="mb-3">
                        <Form.Label>Question {i + 1}</Form.Label>
                        <Form.Control
                            id={"question " + i}
                            type="text"
                            placeholder="What is your question?"
                            defaultValue={(qList.length > i ? qList[i].question : "")}
                            onChange={this.updateQuestion}
                        />
                    </Form.Group>

                    {this.buildAnswerList(qList[i].answerList)}

                    <Form.Control
                        id={"ans " + i}
                        size="sm"
                        type="text"
                        placeholder="Enter new answer (Press Enter to add)"
                        onKeyUp={this.onKeyUp}/>
                </div>
            );
        }

        return (questions);
    }

    updateQuestion = (event) => {
        const questionId = event.target.id.split(' ')[1];
        const questionContent = event.target.value;
        let currentQuestionList = Object.assign({}, this.state.questionList);

        currentQuestionList[questionId].question = questionContent;
    }

    buildAnswerList(answerList) {
        var answers = [];

        for (let i = 0; i < answerList.length; i++) {
            answers.push(
                <ListGroup.Item key={answerList[i]}>{answerList[i]}</ListGroup.Item>
            );
        }

        return (answers);
    }

    onKeyUp = (event) => {
        const questionId = this.getQuestionIndexViaAnswerItemId(event.target.id);
        const answer = event.target.value;

        if (event.key === "Enter") {
            this.addNewAnswer(questionId, answer);

            // Clear answer box
            const answerBox = document.getElementById(event.target.id);
            answerBox.value = "";
        }
    }

    addNewAnswer(questionId, answer) {
        let currentQuestionList = Object.assign({}, this.state.questionList);

        currentQuestionList[questionId].answerList.push(answer);

        this.setState({questionList: currentQuestionList});
    }

    getQuestionIndexViaAnswerItemId(answerItemId) {
        return answerItemId.split(' ')[1];
    }
}