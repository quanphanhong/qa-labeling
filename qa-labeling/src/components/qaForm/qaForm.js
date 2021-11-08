import React from "react";
import './qaForm.css'

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';

import ReactLoading from 'react-loading';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const axios = require ("axios");

export class QAForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            qaItem: [],
            qaItemId: props.qaItemId,
            noLocalQuestions: 0,
            localQuestionList: [],
            questionList: [],
            imageUrl: "",
            currentAnswerListIndex: -1,
            currentAnswerList: [],
            dataIsLoaded: false,
            answerIsLoaded: false,
          }
    }

    async fetchQuestionList() {
        await axios({
            method: "get",
            url: "http://us-central1-question-answering-labeling.cloudfunctions.net/api/case/" + this.state.qaItemId,
            responseType: "stream",
        })
        .then((response) => {
            this.setState({
                qaItem: response.data,
                questionList: response.data.questions,
                localQuestionList: response.data.questions,
                imageUrl: response.data.imgUrl,
                dataIsLoaded: true,
                answerIsLoaded: true,
            });
        });
    }

    async componentDidMount() {
        await this.fetchQuestionList();
    }

    async getAnswerList(questionId) {
        var answerList = [];

        await axios({
            method: "get",
            url: "http://us-central1-question-answering-labeling.cloudfunctions.net/api/case/" + this.state.qaItemId + "/" + questionId,
            responseType: "stream",
        })
        .then((response) => {
            answerList = response.data;
        });

        this.setState({
            currentAnswerList: answerList,
            answerIsLoaded: true,
        });
    }

    buildAnswerList() {
        if (!this.state.answerIsLoaded) {
            return (
                <ReactLoading
                    className="loadingIcon"
                    type="spinningBubbles"
                    color="blue"
                    height="10%"
                    width="10%" />
            );
        }

        var answers = [];
        const answerList = this.state.currentAnswerList;

        for (let i = 0; i <= answerList.length; i++) {
            answers.push(
                <Form.Group key={"a" + i} className="mb-3" controlId="floatingTextarea">
                    <Form.Label>Answer {i + 1}</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Your answer"
                        defaultValue={(answerList.length > i ? answerList[i].answer : "")}
                    />
                </Form.Group>
            );
        }

        return (answers);
    }

    buildQuestionList = () => {
        var questions = [];
        const qList = this.state.localQuestionList;

        const updateAnswerList = async (index) => {
            if (index >= qList.length) return;
            await this.getAnswerList(qList[index].qaItemId);
        }

        for (let i = 0; i < this.state.noLocalQuestions; i++) {
            questions.push(
                <div className="mb-3" key={i}>
                    <Form.Group className="mb-3" controlId="floatingTextarea">
                        <Form.Label>Question {i + 1}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="What is your question?"
                            defaultValue={(qList.length > i ? qList[i].question : "")}
                        />
                    </Form.Group>

                    <Button
                        className="loadAnswersButton"
                        onClick={async () => {
                            if (this.state.currentAnswerListIndex === -1)
                            {
                                this.setState({currentAnswerListIndex: i})
                                await updateAnswerList(i);
                            }
                            else {
                                this.setState({
                                    currentAnswerListIndex: -1,
                                    answerIsLoaded: false,
                                });
                            }
                        }}>View Answers</Button>

                    {this.state.currentAnswerListIndex === i ? this.buildAnswerList() : <></>}
                </div>
            );
        }

        return (questions);
    }

    render() {
        const handleNoQuestionsChanged = (event) => {
            this.setState({noLocalQuestions: event.target.value});
        }

        const updateImageUrl = (event) => {
            this.setState({imageUrl: event.target.value});
        }

        if (!this.state.dataIsLoaded)
            return (<ReactLoading className="loadingIcon" type="spinningBubbles" color="blue" height="50%" width="50%" />)

        return (
            <Col className="formContainer">
                <TransformWrapper as={Row}>
                    <TransformComponent>
                        <img src={this.state.imageUrl} width="100%" alt="PreviewImage"/>
                    </TransformComponent>
                </TransformWrapper>
                <Form as={Row} className="qaForm">
                    <Row className="mb-3">
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

                        <Form.Group as={Col} controlId="floatingTextarea">
                            <Form.Label>Number of questions</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter number of questions"
                                defaultValue={this.state.questionList.length}
                                onChange={handleNoQuestionsChanged}
                            />
                            <Form.Text className="text-muted">
                            </Form.Text>
                        </Form.Group>
                    </Row>

                    {this.buildQuestionList()}

                    <Button variant="primary" type="submit" className="saveButton">
                        Submit
                    </Button>
                </Form>
            </Col>
        );
    };
}