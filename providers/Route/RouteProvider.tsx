import { Loader } from '@/components/Loader';
import { usePathname } from 'next/navigation';
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
import { Page, PAGES } from './PagesConfiguration';

interface RouteProviderProps {
    currentPage: Page | null;
    setCurrentPage: (page: Page | null) => void;
}

const RouteContext = createContext<RouteProviderProps>({
    currentPage: null,
    setCurrentPage: () => {},
});

const RouteProvider: React.FC<{ children?: ReactNode }> = ({
    children,
}: {
    children?: ReactNode;
}) => {
    const [currentPage, setCurrentPage] = useState<Page | null>(null);
    const [isResolved, setIsResolved] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setCurrentPage(PAGES.find((page) => page.path === pathname) || null);
        setIsResolved(true);
    }, [pathname]);

    const value = {
        currentPage,
        setCurrentPage,
    };

    // Mostra o Loader apenas enquanto a rota não foi resolvida. Rota fora do
    // PAGES renderiza normalmente (não-guardada) em vez de travar no Loader.
    return (
        <RouteContext.Provider value={value}>
            {isResolved ? children : <Loader />}
        </RouteContext.Provider>
    );
};

export { RouteProvider };

export function useRoute() {
    return useContext(RouteContext);
}
