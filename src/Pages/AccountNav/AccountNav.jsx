import './AccountNav.css';
import Settings from './Settings.jsx';
import AddFriendModal from './AddFriendModal.jsx';
import FriendRequests from './FriendRequests.jsx';
import Chatroom from './Chatroom.jsx';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { useState } from 'react';
import { BsFillGearFill} from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useLoaderData, useNavigate } from "react-router";
import { IoMdLogOut } from "react-icons/io";
import axios from 'axios';

export default function AccountNav({socket}) {
    const { sound, myFriends, userSearch, myRequests } = useLoaderData();
    const mySounds = useSelector(state => state.favorites.mySounds);
    const user = useSelector(state => state.login.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [modalState, setModalState] = useState(false);
    const [friendRequestModalState, setFriendRequestModalState] = useState(false);
    const [sounds, setSounds] = useState(sound ? sound : null);
    const [toDelete, setToDelete] = useState(mySounds ? mySounds[0] ? mySounds[0].soundscapeId : null : null);
    const [searchInput, setSearchInput] = useState();
    const [friendReqList, setFriendReqList] = useState([]);
    const [friendslist, setFriendslist] = useState([]);
    const [joinFailed, setJoinFailed] = useState(false);

    const getSounds = async() => {
        const { data: { favs } } = await axios.get('/api/sounds');
        dispatch({type: 'login-get', payload: favs});
    };
    const getLoginStatus = async() =>{
        const {data}= await axios.get('/api/auth/status');
        if(!data.user){
            dispatch({type: 'modal-on'});
        }
        await getSounds();
        return dispatch({type: "loginstatus", payload:data})
    }
    useEffect(()=>{
        getLoginStatus()
    },[])



    const setFriendsListHandler = (newFriendsList) => {
        setFriendslist(newFriendsList);
    };

    useEffect(() => {
        if (myFriends) {
            setFriendslist(myFriends);
        } else {
            setFriendslist([]);
        };
    }, [myFriends]);


//Friendslist
        let friendsListMapped = friendslist.map((friend) => {
            return <div key={friend.user.username} className='friendname'>{friend.user.username}
                        <button
                            className = "join-btn"
                            onClick={() => {
                                navigate(`/${friend.user.username}`);
                            }}
                        >Join</button>
                        <button
                        className = "trash-btn"
                        ><MdDelete 
                        onClick={async()=>{
                            let {data} = await axios.delete(`/api/deletefriend/${friend.user.userId}`)
                            setFriendslist(data.myFriends)
                        }}
                        /></button>
                    </div>
        });

//Logout
        const logoutUser = async () => {
            const { data } = await axios.post('/api/auth/logout');
            if (data.success) {
            dispatch({ type: 'logout' });
            dispatch({type: 'modal-on'})
            navigate("/");
            };
        };

//joinfail


    return (
        <main className="account-nav">
            <div className="account">
                <div className='username'>
                    <h2>{user ? user.username : 'Guest'}</h2>
                </div>
                <div className='logout-and-settings'>
                    <button
                        className='logout-btn'
                        onClick={() => logoutUser()}>
                        <IoMdLogOut
                            className='exit-door'
                        />
                    </button>
                    <button 
                        className="settings-btn"
                        onClick={() => setModalState(!modalState)}>
                        <BsFillGearFill 
                            className='cog'
                        />
                    </button>
                </div>
            </div>
            {modalState ?
            <Settings
                mySounds={mySounds}
                toDelete={toDelete}
                setToDelete={setToDelete}
                userId = {user.userId}
                username = {user.username}
                email = {user.email}
                modalState = {modalState}
                setModalState = {setModalState}
            />
            :
            <div className='friends-div'>
                <div className="add-friend">
                    <button className="add-friend-btn" 
                            onClick={setFriendRequestModalState}>
                            Add friends
                    </button>
                    {friendRequestModalState ?
                    <AddFriendModal
                        userId = {user.userId}
                        username = {user.username}
                        searchInput  = {searchInput}
                        setSearchInput = {setSearchInput}
                        friendReqList = {friendReqList}
                        setFriendReqList = {setFriendReqList}
                        userSearch = {userSearch}
                        friendRequestModalState = {friendRequestModalState} 
                        setFriendRequestModalState = {setFriendRequestModalState}
                    />
                    :
                    <></>
                    }
                </div>
                <div className="">
                    {user && myRequests ? myRequests[0] ? <FriendRequests
                        user = {user}
                        myRequests = {myRequests}
                        myFriends = {myFriends}
                        setFriendsList = {setFriendsListHandler}
                    />
                    :
                    <></>
                    :
                    <></>
                    }
                </div>
                <div className='friends-list'>
                    <h4 className = "friends-label">Friends - {friendsListMapped.length}</h4>
                    <div className="friends">
                        {friendsListMapped}
                    </div>
                </div>
                {joinFailed && <p>Room is not available. Please try again.</p>}
            </div>
            }
            <div className="chatbox">
                <h1 className="chatroom-title">Chatroom</h1>
                {user ?
                <Chatroom
                    user={user}
                    socket={socket}
                />
                :
                <></>
                }
            </div>
        </main>
    );
};