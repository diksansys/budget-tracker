import {db,doc, where, query, setDoc, collection, getDocs} from '../app.js';
import {User,userConverter} from '../Entity/user.js';

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

function signout() {
    eraseCookie('loginToken');
    google.accounts.id.disableAutoSelect();
    setTimeout(()=> {location.href="login.html"}, 1000)
}

function setCookie(name, value, time) {
    var expires = "";
    if (time) {
        var date = new Date();
        date.setTime(date.getTime() + time);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

async function handleCredentialResponse(response) { 

    var responseData = parseJwt(response.credential); // Response data

    // Query to verify access level
    let q = query(collection(db, "allowedUsers").withConverter(userConverter), where('email', '==', responseData.email));
    let querySnapshot = await getDocs(q);
    let result = null;
    querySnapshot.forEach((resp) => {
        if (resp.data()) {
            result = resp.data(); 
            result.id = resp.id;
        }
    })
    if (result) { 
        
        if (result.firstName === "" || result.firstName === null || result.firstName === undefined) {
            result.firstName = responseData.given_name;
        }
        if (result.lastName === "" || result.lastName === null || result.lastName === undefined) {
            result.lastName = responseData.family_name;
        }
        if (result.profilePic === "" || result.profilePic === null || result.profilePic === undefined) {
            result.profilePic = responseData.picture;
        }

        result.isLoggedIn = true;
        result.loginToken = responseData.sub;

        const docRef = doc(db, "allowedUsers", result.id);
        const data = userConverter.toFirestore(result);
        setDoc(docRef, data).then((r) => {
            console.log('succesfully logged in');
            location.href = "index.html";
        }).catch((error) => {
            console.log(error); 
            location.href = "index.html";
        });

        // Set user session
        setCookie('loggedInUser', result.loginToken, 3600 * 1000); // Setting cookie for one hour
    } else {
        alert('Access Denied!');
        location.href="login.html";
    }
}

window.onload = async function () {
    let loginToken = getCookie('loggedInUser');
    if (loginToken) { // If login token exist
        let q = query(
            collection(db, "allowedUsers").withConverter(userConverter), 
            where('loginToken', '==', loginToken), 
            where('isLoggedIn', '==', true)
        );
        const querySnapshot = await getDocs(q); 
        querySnapshot.forEach((resp) => { 
            if (resp) { 
                // Already logged in
                console.log('user logged in already'); 
                location.href = "index.html";
            } else {
                // Unknown / hack request
                eraseCookie('loggedInUser');
                alert('Access Denied!');
                location.href="login.html";
            }
        });
    } else { // Follow usual flow
        google.accounts.id.initialize({
            client_id: "88167872801-vflalanjtkb6lpnc8hgq35odn55q688a.apps.googleusercontent.com",
            callback: handleCredentialResponse
        });
        google.accounts.id.renderButton(
            document.getElementById("loginBtnSection"),
            { theme: "outline", size: "large" }  // customization attributes
        );
        google.accounts.id.prompt(); // also display the One Tap dialog 
    } 
};

export {parseJwt,signout,getCookie,setCookie,eraseCookie,handleCredentialResponse};