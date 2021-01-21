import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
export function getPasscode() {
    const match = window.location.search.match(/passcode=(.*)&?/);
    const passcode = match ? match[1] : window.sessionStorage.getItem('passcode');
    return passcode;
}
export function fetchToken(name, room, passcode, create_room = true) {
    return fetch(`/token`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ user_identity: name, room_name: room, passcode, create_room }),
    });
}
export function verifyPasscode(passcode) {
    return fetchToken('temp-name', 'temp-room', passcode, false /* create_room */).then(async (res) => {
        const jsonResponse = await res.json();
        if (res.status === 401) {
            return { isValid: false, error: jsonResponse.error?.message };
        }
        if (res.ok && jsonResponse.token) {
            return { isValid: true };
        }
    });
}
export function getErrorMessage(message) {
    switch (message) {
        case 'passcode incorrect':
            return 'Passcode is incorrect';
        case 'passcode expired':
            return 'Passcode has expired';
        default:
            return message;
    }
}
export default function usePasscodeAuth() {
    const history = useHistory();
    const [user, setUser] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [roomType, setRoomType] = useState();
    const getToken = useCallback((name, room) => {
        return fetchToken(name, room, user.passcode)
            .then(async (res) => {
            if (res.ok) {
                return res;
            }
            const json = await res.json();
            const errorMessage = getErrorMessage(json.error?.message || res.statusText);
            throw Error(errorMessage);
        })
            .then(res => res.json())
            .then(res => {
            setRoomType(res.room_type);
            return res.token;
        });
    }, [user]);
    useEffect(() => {
        const passcode = getPasscode();
        if (passcode) {
            verifyPasscode(passcode)
                .then(verification => {
                if (verification?.isValid) {
                    setUser({ passcode });
                    window.sessionStorage.setItem('passcode', passcode);
                    history.replace(window.location.pathname);
                }
            })
                .then(() => setIsAuthReady(true));
        }
        else {
            setIsAuthReady(true);
        }
    }, [history]);
    const signIn = useCallback((passcode) => {
        return verifyPasscode(passcode).then(verification => {
            if (verification?.isValid) {
                setUser({ passcode });
                window.sessionStorage.setItem('passcode', passcode);
            }
            else {
                throw new Error(getErrorMessage(verification?.error));
            }
        });
    }, []);
    const signOut = useCallback(() => {
        setUser(null);
        window.sessionStorage.removeItem('passcode');
        return Promise.resolve();
    }, []);
    return { user, isAuthReady, getToken, signIn, signOut, roomType };
}
