import bot from './assets/bot.svg';
import user from './assets/user.svg';

// have to target HTML using JS Query as not using react

const form = document.querySelector('form');
const chatContainer = document.querySelector("#chat_container");

let loadInterval; //-> Variable

//Function to load our messages(Response)
function loader(element){
  element.textContent='';

  loadInterval = setInterval(()=>{element.textContent+='.';
if(element.textContent==='....'){
  element.textContent='';
}},300) //-->Every 300 milisecond . . . .  //After 4 .  it reset the string to empty string
}
// API write text one by one , So to done this we use this function
function typeText(element,text){
  let index=0;

  let interval = setInterval(()=>{
    if(index < text.length){
      element.innerHTML +=text.charAt(index);
      index++;
    }
    else{
      clearInterval(interval);
    }
  },20)
}

// Unique Id for every messages
function generateUniqueId(){
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  // `` --> Template String
  return `id:-${timeStamp}-${hexadecimalString}`;
}
// Chatstripe --> If User data --> Dark Gray 
// AI response --> Gray Stripe for Ai Response
function chatStripe(isAi,value,uniqueId){
  return(
    `<div class="wrapper ${isAi && 'ai'}">
        <div class ="chat">
          <div class="profile">
          <img src="${isAi ? bot : user}" alt="${isAi ? 'botImage' : 'usertImage'}"/>
          </div>
          <div class="message" id=${uniqueId}>${value}</div>
        </div>
    </div>`
  )
}

//Ai Generated Response
const handleSubmit=async(event)=>{
  event.preventDefault();

  const data = new FormData(form);

  // User's ChatStripe
  chatContainer.innerHTML +=chatStripe(false,data.get('prompt'));
  form.reset();

  // Ai Bot Chat stripe

  const uniqueId = generateUniqueId();
  chatContainer.innerHTML +=chatStripe(true," ",uniqueId);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv=document.getElementById(uniqueId);
  loader(messageDiv);

  //Fetch data from server --> Using Open AI key --> Chat Bot response
  const response = await fetch('https://chatgpt-project-namanmalhotra.onrender.com', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        prompt: data.get('prompt')
    })
})

clearInterval(loadInterval)
messageDiv.innerHTML = " "

if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

    typeText(messageDiv, parsedData)
} else {
    const err = await response.text()

    messageDiv.innerHTML = "Something went wrong"
    alert(err)
}
}
form.addEventListener('submit',handleSubmit);
form.addEventListener('keyup',(eEnter)=>{
  if(eEnter.keyCode===13){
    handleSubmit(eEnter);
  }
})



