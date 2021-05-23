import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socketIOClient from "socket.io-client";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import config from "../Config";

import { chatInit } from "../actions/auth";

const endPoint = config.ENDPOINT;
const socket = socketIOClient(endPoint, { transports: ['websocket'] });

/**
 * require validation
 * @param {*} value 
 */
const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};


const Chat = (props) => {
    const { user: currentUser } = useSelector((state) => state.auth);

    const checkBtn = useRef();
    const form = useRef();
    const bottomRef = useRef();


    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [messages, setMessages] = useState([]);
    const [loginUser, setLoginUser] = useState("");
    const [userList, setUserList] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [changeName, setChangeName] = useState("");
    //const Array = [5, 4, 3, 2, 1]


    const scrollToBottom = () => {
        // bottomRef.current.scrollIntoView({
        //     behavior: "smooth",
        //     block: "start",
        // });
    };

    /**
   * Start chat
   * @param {*} e 
   */
    const startChat = (e) => {
        e.preventDefault();

        setLoading(true);

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            let setData = {
                name: name,
            }
            dispatch(chatInit(setData))
                .then(() => {
                    props.history.push("/");
                    window.location.reload();
                })
                .catch(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    };

    // if (!currentUser) {
    //     return <Redirect to="/login" />;
    // }

    // useEffect(() => {



    //     console.log("socket ==>", socket)
    //     socket.on("FromAPI", () => {
    //         console.log("call ==>", socket)
    //         //setMessaege(data);
    //     });

    //     // CLEAN UP THE EFFECT
    //     //return () => socket.disconnect();
    //     //
    // }, []);
    const handleNewMessage = () => {
        console.log('emitting new message', newMessage);
        let setMessage = {
            fromUserId: loginUser.id,
            message: newMessage,
            toUserId: selectedUser.id
        }
        socket.emit('message', setMessage);
    }

    const chatWithUser = (chatWithUser) => {
        setSelectedUser(chatWithUser)
        setNewMessage("")
        scrollToBottom()
        let setMessage = {
            fromUserId: loginUser.id,
            toUserId: chatWithUser.id
        }
        socket.emit('getMessages', setMessage);
    }

    const disconnectSocket = () => {
        console.log('Disconnecting socket...');
        if (socket) socket.disconnect();
    }

    const changeNameHandlar = () => {
        //console.log("changeName ==>", changeName)
        let data = {
            name: changeName,
            id: loginUser.id
        }
        socket.emit('changeName', data);
    }

    useEffect(() => {

        for (let j = 5; j >= 0; j--) {
            var v = []
            for (let index = 5; index > j; index--) {
                //console.log(index);
                v.push(index)
                //const element = array[index];

            }
            console.log("var ==>", v.toString().replaceAll(",", ""))
        }

    }, [])

    useEffect(() => {
        if (currentUser) {
            socket.emit('addUser', currentUser.data);
            socket.on('addUserResponce', payload => {
                setLoginUser(payload)
                //setUserList(payload.userList)
            });
            socket.on('userListResponce', payload => {
                //console.log("payload ==>", payload)
                //setLoginUser(payload.loginUser)
                setUserList(payload)
            });
            socket.on('messageResponce', payload => {
                //console.log("payload", payload)
                setMessages(payload.data)
                setNewMessage("")
            });
            socket.on('changeNameResponce', payload => {
                console.log("payload ==>", payload)
            });
            socket.on('getMessagesResponce', payload => {
                //console.log("payload", payload)
                setMessages(payload.data)
            });

            return () => {
                disconnectSocket();
            }
        }
    }, []);

    return (
        <>
            {currentUser ? (
                <>
                    <div className="container-fluid h-100">
                        <div className="row justify-content-center h-100">
                            <div className="col-md-4 col-xl-3 chat"><div className="card mb-sm-3 mb-md-0 contacts_card">
                                <div className="card-header">
                                    <div className="input-group">
                                        {loginUser.name}
                                        <input type="text" placeholder="Change Name" name="changeName" className="form-control search" value={changeName} onChange={(e) => setChangeName(e.target.value)} />
                                        {/* <div className="input-group-prepend">
                                            <span className="input-group-text search_btn"><i className="fas fa-search"></i></span>
                                        </div> */}
                                        <button className="btn btn-primary btn-block" onClick={() => changeNameHandlar()}> Change name </button>
                                    </div>
                                </div>
                                <div className="card-body contacts_body">
                                    <ul className="contacts">
                                        {userList && userList.length > 0 && userList.map((user, i) => {
                                            return (
                                                <>
                                                    {user.id !== loginUser.id &&
                                                        <li className={selectedUser.id === user.id ? 'active' : ''} onClick={() => chatWithUser(user)} key={user.id}>
                                                            <div className="d-flex bd-highlight">
                                                                <div className="img_cont">
                                                                    <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" className="rounded-circle user_img" />
                                                                    <span className="online_icon"></span>
                                                                </div>
                                                                <div className="user_info">
                                                                    <span>{user.name}</span>
                                                                    <p>{user.userId} is {user.isOnline ? 'online' : 'offline'}</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    }
                                                </>
                                            )
                                        })}

                                        {/* <li>
                                            <div className="d-flex bd-highlight">
                                                <div className="img_cont">
                                                    <img src="https://2.bp.blogspot.com/-8ytYF7cfPkQ/WkPe1-rtrcI/AAAAAAAAGqU/FGfTDVgkcIwmOTtjLka51vineFBExJuSACLcBGAs/s320/31.jpg" className="rounded-circle user_img" />
                                                    <span className="online_icon offline"></span>
                                                </div>
                                                <div className="user_info">
                                                    <span>Taherah Big</span>
                                                    <p>Taherah left 7 mins ago</p>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex bd-highlight">
                                                <div className="img_cont">
                                                    <img src="https://i.pinimg.com/originals/ac/b9/90/acb990190ca1ddbb9b20db303375bb58.jpg" className="rounded-circle user_img" />
                                                    <span className="online_icon"></span>
                                                </div>
                                                <div className="user_info">
                                                    <span>Sami Rafi</span>
                                                    <p>Sami is online</p>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex bd-highlight">
                                                <div className="img_cont">
                                                    <img src="http://profilepicturesdp.com/wp-content/uploads/2018/07/sweet-girl-profile-pictures-9.jpg" className="rounded-circle user_img" />
                                                    <span className="online_icon offline"></span>
                                                </div>
                                                <div className="user_info">
                                                    <span>Nargis Hawa</span>
                                                    <p>Nargis left 30 mins ago</p>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex bd-highlight">
                                                <div className="img_cont">
                                                    <img src="https://static.turbosquid.com/Preview/001214/650/2V/boy-cartoon-3D-model_D.jpg" className="rounded-circle user_img" />
                                                    <span className="online_icon offline"></span>
                                                </div>
                                                <div className="user_info">
                                                    <span>Rashid Samim</span>
                                                    <p>Rashid left 50 mins ago</p>
                                                </div>
                                            </div>
                                        </li> */}
                                    </ul>
                                </div>
                                <div className="card-footer"></div>
                            </div></div>
                            <div className="col-md-8 col-xl-6 chat">
                                <div className="card">
                                    <div className="card-header msg_head">
                                        <div className="d-flex bd-highlight">
                                            <div className="img_cont">
                                                <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" className="rounded-circle user_img" />
                                                <span className="online_icon"></span>
                                            </div>
                                            <div className="user_info">
                                                <span>Chat with {selectedUser.userId}</span>
                                                {/* <p>1767 Messages</p> */}
                                            </div>
                                            <div className="video_cam">
                                                <span><i className="fas fa-video"></i></span>
                                                <span><i className="fas fa-phone"></i></span>
                                            </div>
                                        </div>
                                        <span id="action_menu_btn"><i className="fas fa-ellipsis-v"></i></span>
                                        <div className="action_menu">
                                            <ul>
                                                <li><i className="fas fa-user-circle"></i> View profile</li>
                                                <li><i className="fas fa-users"></i> Add to close friends</li>
                                                <li><i className="fas fa-plus"></i> Add to group</li>
                                                <li><i className="fas fa-ban"></i> Block</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="card-body msg_card_body">

                                        {selectedUser.id &&
                                            <>
                                                <div className="autoscroll-container">
                                                    {messages && messages.length > 0 && messages.map((msg, i) => {
                                                        return (
                                                            <div className={msg.fromUserId === loginUser.id ? 'd-flex justify-content-end mb-4' : 'd-flex justify-content-start mb-4'}>
                                                                <div className="img_cont_msg">
                                                                    <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" className="rounded-circle user_img_msg" />
                                                                </div>
                                                                <div className="msg_cotainer">
                                                                    {msg.message}
                                                                    {/* <span className="msg_time">8:40 AM, Today</span> */}
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                    <div ref={bottomRef} className="list-bottom"></div>
                                                </div>
                                            </>

                                        }
                                    </div>
                                    <div className="card-footer">
                                        <div className="input-group">
                                            <div className="input-group-append">
                                                <span className="input-group-text attach_btn"><i className="fas fa-paperclip"></i></span>
                                            </div>
                                            <textarea name="newMessage" className="form-control type_msg" placeholder="Type your message..." onChange={(e) => setNewMessage(e.target.value)} value={newMessage}>{newMessage}</textarea>
                                            <div className="input-group-append" onClick={() => handleNewMessage()}>
                                                {/* <span className="input-group-text send_btn"><i className="fa fa-location-arrow"></i></span> */}
                                                <button className="btn btn-primary btn-block"> send </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="col-md-12">
                        <div className="card card-container">
                            <Form onSubmit={startChat} ref={form}>
                                <div className="form-group">
                                    <label htmlFor="email">Enter your name</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        validations={[required]}
                                    />
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-primary btn-block" disabled={loading}>
                                        {loading && (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        )}
                                        <span>Start Chat</span>
                                    </button>
                                </div>
                                <CheckButton style={{ display: "none" }} ref={checkBtn} />
                            </Form>
                        </div>
                    </div>

                </>
            )
            }

        </>
    );
};

export default Chat;