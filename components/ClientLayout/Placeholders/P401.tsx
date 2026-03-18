import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function P401() {
    const router = useRouter();

    useEffect(() => {
        router.push('/login');
    }, []);

    return <></>
}