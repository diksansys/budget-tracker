class User {
    constructor ( 
        email,
        firstName,
        lastName,
        profilePic,
        loginToken = null,
        isLoggedIn = false
    ) { 
        this.email = email
        this.firstName = firstName
        this.lastName = lastName
        this.profilePic = profilePic
        this.loginToken = loginToken
        this.isLoggedIn = isLoggedIn
    } 
}

const userConverter = {
    toFirestore: (user) => {
        let isLoggedIn = user.isLoggedIn ? true : false;
        return {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePic: user.profilePic,
            loginToken: user.loginToken,
            isLoggedIn: isLoggedIn
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options); 
        return new User( 
            data.email, 
            data.firstName, 
            data.lastName, 
            data.profilePic,
            data.loginToken ,
            data.isLoggedIn
        );
    }
};

export {User,userConverter};