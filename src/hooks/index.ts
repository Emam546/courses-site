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
