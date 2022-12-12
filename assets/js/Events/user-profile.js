function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

$(document).ready(() => {
    $(".uidLogoutBtn").click(() => {
        if (confirm("Are you sure to logout?")) {
            eraseCookie('loggedInUser');
            //google.accounts.id.disableAutoSelect();
            setTimeout(()=> {location.href="login.html"}, 1000)
        }
    })
})