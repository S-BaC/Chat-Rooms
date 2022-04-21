//ChatRoom and Todo List

const chats = db.collection('chats');
const msgDisplayed = document.querySelector('#messagesOnDisplay');
const loginPanel = document.querySelector('.changeAcc');
const loginForm = document.querySelector('#loginForm');
let currentroomObj = document.querySelector('#general');

// A.   CHATROOMS  
//1. Handling everything functionally dependent on chatrooms:
class ChatRoom{
    constructor(user,room){
        this.user = user;
        this.room = room;
        this.createdTime;
        this.unsub;
    }
    async sendMsg(msg){
        let now = new Date();
        let chatObj ={
            user:this.user,
            room:this.room,
            msg:msg,
            createdAt: firebase.firestore.Timestamp.fromDate(now)
        }
        await chats.add(chatObj).then(console.log("added"));
    }
    getMsg(displayMsg){
        this.unsub = chats.where('room','==', this.room)
            .orderBy('createdAt')
            .onSnapshot(snapshot => {snapshot.docChanges().forEach(change=>{
            if(change.type==='added'){
                //Updates the UI
                displayMsg(change.doc.data());
            }
        })
        })
    }
    updateName(name){
        this.user = name;
        document.querySelector('#usernameDisplay').textContent = this.user;
    }
    updateRoom(room){
        clearMsg();
        this.room = room;
        if(this.unsub){
            this.unsub();
        }
    }
}

const chatroom = new ChatRoom('mario', 'general');
chatroom.getMsg(displayMsg);

function setRoom(roomObj){
    currentroomObj.classList.remove('btnClicked');
    currentroomObj = roomObj;
    roomObj.classList.add('btnClicked');
    chatroom.updateRoom(roomObj.id);
    chatroom.getMsg(displayMsg);
}

// 2. For the Input and Display

//Preventing the page from being refreshed after submission.
document.querySelector('form').addEventListener('submit', e=>{
    e.preventDefault();
})

//Sending the chat by clicking the button.
function sendChat(){
    const msg = document.querySelector('.chatSendI').value;
    chatroom.sendMsg(msg);
    document.querySelector('#chatForm').reset();
}

//Updating the UI
function displayMsg(data){
    const time = dateFns.distanceInWordsToNow(
                    data.createdAt.toDate(),{addSuffix:true});
    msgDisplayed.innerHTML += 
        `<li> <span class="senderName">${data.user}:</span> 
        <span>${data.msg}</span>
        <div class="chattime">${time}</div>
        </li>`;
}

function clearMsg(){
    msgDisplayed.innerHTML = '';
}



// 3. Changing Accounts
function loginAcc(){
    loginPanel.style.display = 'block';
}

loginForm.addEventListener('submit',e=>{
    e.preventDefault();
    const username = loginForm.username.value.trim();
    chatroom.updateName(username);
    loginForm.reset();
    loginPanel.style.display = 'none';
})

//METHOD TO DELETE ALL DATA FROM A ROOM.
function deleteData(room){
    let testArray = [1,2,3];
    console.log(testArray);
    console.log(testArray[2]);
    chats.where('room', '==',room)
        .get()
        .then(response => response.docs.forEach(element=>chats.doc(element.id).delete()))
        .then(console.log("completed"));
}

function deleteAll(){
    deleteData('play');
    deleteData('work');
    deleteData('general');
}

//deleteAll();

//Extra Stuffs
let x = 0;
function changeBg(){
    x==7 ? x=0 : x=x;
    document.querySelector('body').style.backgroundImage = `url('photos/bg${x}.jpg')`;
    x++;
}