import React, { Component } from 'react';
import { useState } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Row, Col, Input } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = val => val && val.length;
const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);
const isNumber = val => !isNaN(+val);
const validEmail = val => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);
   
function RenderCampsite({campsite}){
         
            return (
                <div className="col-md-5 m-1">
                    <FadeTransform
                        in
                        transformProps={{
                            exitTransform: 'scale(0.5) translateY(-50%)'
                        }}>
                        <Card>
                            <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                            <CardBody>
                                <CardText>{campsite.description}</CardText>
                            </CardBody>
                        </Card>
                    </FadeTransform>
                </div>
            )
        }


        function RenderComments({comments, postComment, campsiteId}) {
            if (comments) {
             return (
             <div className="col-md-5 m-1">
                 <h4>Comments</h4>
                    <Stagger in>
                        {comments.map(comment => {
                            return (
                                <Fade in key={comment.id}>
                                    <div>
                                        <p>{comment.text}<br />
                                            -- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                                        </p>
                                    </div>
                                </Fade>
                            );
                        })}
                    </Stagger>
                 <CommentForm campsiteId={campsiteId} postComment={postComment} />
             </div>
             );
            }
            return <div />
         }
        
         class CommentForm extends Component {
            constructor(props){
                super(props);
                this.state = {
                isModalOpen: false
                }

                this.toggleModal = this.toggleModal.bind(this);
                }

                toggleModal() {
                    this.setState({
                        isModalOpen: !this.state.isModalOpen
                    });
                }
                
                handleSubmit(values) {
                    this.toggleModal();
                    this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
                }
              
                render() {
                  return (
                    <div className="Container">
                        <button outline onClick={this.toggleModal}> <i className="fa fa-pencil fa-lg" />
                         Submit Comment
                        </button>

                        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}
                        onClose={this.toggleModal} >
                        <ModalHeader toggle={this.toggleModal}>
                            Submit Comment
                        </ModalHeader>
                        <ModalBody>
                        <LocalForm onSubmit={values => this.handleSubmit(values)}>
                            <Row className="form-group">
                                <Label htmlFor="rating" md={10}>Rating</Label>
                            </Row>
                            <Row>
                                <Col md={10}>
                                    <Control.select
                                        model=".rating"
                                        name="rating"
                                        className="form-control"
                                        defaultValue="1">
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                    </Control.select>
                                    <Errors
                                        className="text-danger"
                                        model=".rating"
                                        show="touched"
                                        component="div"
                                    />
                                </Col>
                            </Row>
                            
                            <Row className="form-group">
                                <Label htmlFor="yourName" md={10}>Your Name</Label>
                            </Row>
                            <Row>
                                <Col md={10}>
                                    <Control.text model=".yourName" id="yourName" name="yourName"
                                        placeholder="Your Name"
                                        className="form-control"
                                        validators={{
                                            required,
                                            minLength: minLength(2),
                                            maxLength: maxLength(15)
                                        }}
                                    />
                                    <Errors
                                        className="text-danger"
                                        model=".yourName"
                                        show="touched"
                                        component="div"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be at least 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comment" md={10}>Comment</Label>
                            </Row>
                            <Row>
                                <Col md={10}>
                                    <Control.textarea model=".comment" id="comment" name="comment"
                                        rows="12"
                                        className="form-control"
                                    />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col md={{size: 10}}>
                                    <Button type="submit" color="primary">
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </LocalForm>
                        </ModalBody>
                        </Modal>
                    </div>
                  );
                }
              }
            
               


    function CampsiteInfo(props) {
        if (props.isLoading) {
            return (
                <div className="container">
                    <div className="row">
                        <Loading />
                    </div>
                </div>
            );
        }
        if (props.errMess) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h4>{props.errMess}</h4>
                        </div>
                    </div>
                </div>
            );
        }
        if (props.campsite) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <Breadcrumb>
                                <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                                <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                            </Breadcrumb>
                            <h2>{props.campsite.name}</h2>
                            <hr />
                        </div>
                    </div>
                    <div className="row">
                        <RenderCampsite campsite={props.campsite} />
                        <RenderComments 
                        comments={props.comments}
                        postComment={props.postComment}
                        campsiteId={props.campsite.id}
                        />
                    </div>
                </div>
            );
        return <div />;
        }
    }


          


export default CampsiteInfo;


      