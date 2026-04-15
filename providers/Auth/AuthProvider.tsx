import { UserProfileDto } from '@/dtos/UserDto';
import { STORE_KEYS } from '@/utils/contants/Stores';
import {
    getStoreAuthToken,
    removeStoreAuthToken,
    setStoreAuthToken,
} from '@/utils/stores/auth';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

interface AuthProviderProps {
    isHydrated: boolean;
    user: UserProfileDto | null | undefined;
    isLogged: () => boolean;
    setAuthToken: (token?: string, rememberMe?: boolean) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthProviderProps>({
    isHydrated: false,
    user: null,
    isLogged: () => false,
    setAuthToken: () => {},
    logout: () => null,
});

const AuthProvider: React.FC<{ children?: ReactNode }> = ({
    children,
}: {
    children?: ReactNode;
}) => {
    const [user, setUser] = useState<UserProfileDto | null | undefined>(
        undefined,
    );
    const [isHydrated, setIsHydrated] = useState<boolean>(false);
    const [token, setToken] = useState<string | undefined>();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem(STORE_KEYS.token);
        if (token) {
            setAuthToken(token);
        } else {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        if (token) {
            const decoded = jwtDecode<UserProfileDto>(token);
            setUser({ ...decoded });
        } else {
            setUser(null);
        }
    }, [token]);

    useEffect(() => {
        if (user === undefined) return;
        setIsHydrated(true);
    }, [user]);

    const isLogged = () => !!getStoreAuthToken();

    const setAuthToken = (token?: string, rememberMe?: boolean) => {
        setToken(token);
        if (token) {
            setStoreAuthToken(token, rememberMe);
        } else {
            removeStoreAuthToken();
        }
    };

    const logout = () => {
        setToken(undefined);
        removeStoreAuthToken();
        router.push('/login');
    };

    const value = {
        isHydrated,
        user,
        isLogged,
        setAuthToken,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export { AuthProvider };

export function useAuth() {
    return useContext(AuthContext);
}
