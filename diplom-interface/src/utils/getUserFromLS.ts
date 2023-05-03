export const getUserFromLS = () => {
    const data = localStorage.getItem('user')
    return data ? JSON.parse(data) : {
        id: null,
        login: null,
        password: null,
        role: null,
        email: null,
        phoneNumber: null,
        requests: [],
        favorites: []
    };
}