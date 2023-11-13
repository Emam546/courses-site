import { useEffect, useLayoutEffect, useState } from "react";

export function changeTitle(name: string) {
    if (typeof window != "undefined") {
        window.document.title = name;
    }
}
export function useForceUpdate() {
    const [i, setI] = useState(0);
    return () => setI(i + 1);
}
export function useResetTitle() {
    const [org, setOrg] = useState<string>("");
    function resetTitle() {
        if (typeof window != "undefined") {
            window.document.title = org;
        }
    }
    useLayoutEffect(() => {
        setOrg(window.document.title);
    }, []);
    return resetTitle;
}
export function useChangeTitle(title: string) {
    useEffect(() => {
        window.document.title = title;
    }, [title]);
}
export function useConnected(): ReturnType<typeof useState<boolean>> {
    const [isOnline, setIsOnline] = useState(
        typeof navigator != "undefined" ? navigator.onLine : true
    );

    useEffect(() => {
        function onlineHandler() {
            setIsOnline(true);
        }

        function offlineHandler() {
            setIsOnline(false);
        }

        window.addEventListener("online", onlineHandler);
        window.addEventListener("offline", offlineHandler);

        return () => {
            window.removeEventListener("online", onlineHandler);
            window.removeEventListener("offline", offlineHandler);
        };
    }, []);
    return [isOnline, setIsOnline] as ReturnType<typeof useState<boolean>>;
}
