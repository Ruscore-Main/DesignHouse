export const getUserFromLS = () => {
    const data = localStorage.getItem('user')
    const fallbackUser = {
        id: null,
        login: null,
        password: null,
        role: null,
        email: null,
        phoneNumber: null,
        favorites: []
    };

    if (!data) {
        return fallbackUser;
    }

    const user = JSON.parse(data);

    return {
        ...fallbackUser,
        ...user,
        favorites: Array.isArray(user.favorites) ? user.favorites : []
    };
}
