const recognition = new (window.SpeechRecognition || webkitSpeechRecognition)();
recognition.Lang = "en-US";
const btn = document.querySelector("#btn");
btn.addEventListener("click" , () => {
    // convert text to voice
    function speak (text){
        const abc = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(abc);
    }
    function handleCommands(command){
        if(command.includes("open youtube")){
            speak("Opening Youtube...")
            window.open("https://www.youtube.com","_blank")
    }else if(command.includes("open whatsapp")){
        speak("Opening Whatsapp...")
        window.open("https://www.whatsapp.com","_blank")
}else if(command.includes("open instagram")){
    speak("Opening Instagram...")
    window.open("https://www.instagram.com","_blank")
}
else if(command.includes("open facebook")){
    speak("Opening facebook...")
    window.open("https://www.facebook.com","_blank")
}else if(command.includes("open google")){
    speak("Opening google...")
    window.open("https://www.google.com","_blank")
}else if(command.includes("jo tum mere ho")){
    speak("Playing song...")
    window.open("https://www.youtube.com/watch?v=ilNt2bikxDI&list=RDilNt2bikxDI&start_radio=1","_blank")
}
else if(command.includes("open course")){
    speak("Playing ...")
    window.open("https://www.youtube.com/watch?v=fB00t4At0rk&t=7955s","_blank")
}
else if(command.includes("open w3school")){
    speak("Opening w3school...")
    window.open("https://www.w3schools.com","_blank")
}
 else{
    speak("search on google...");
    window.open(`https://www.google.com/search?q=${command}`,"_blank");
 }
 }
 speak("Hello...Sir...how can i help you")

    setTimeout(()=>{
        recognition.start();
    },2000);

 recognition.onresult= (event) =>{
   const command = event.results[0][0].transcript.toLowerCase() 
   handleCommands(command);
 };
});

