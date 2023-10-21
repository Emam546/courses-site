import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { DependencyList } from "react";

export function useForceUpdate() {
    const [i, setI] = useState(0);
    return () => setI(i + 1);
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
export function useSyncRefs<TType>(
    ...refs: (
        | React.MutableRefObject<TType | null>
        | ((instance: TType) => void)
        | null
    )[]
) {
    const cache = React.useRef(refs);

    React.useEffect(() => {
        cache.current = refs;
    }, [refs]);

    return React.useCallback(
        (value: TType) => {
            for (let ref of cache.current) {
                if (ref == null) {
                    continue;
                }
                if (typeof ref === "function") {
                    ref(value);
                } else {
                    ref.current = value;
                }
            }
        },
        [cache]
    );
}

export function useNotInitEffect(
    effect: React.EffectCallback,
    deps: [string | number | boolean]
) {
    const cur = useRef(deps);
    return useEffect(() => {
        const state = cur.current!.some((val, i) => val != deps[i]);
        if (state) return effect();
    }, deps);
}

export function useDebounceEffect(
    fn: (deps?: DependencyList) => void,
    waitTime: number,
    deps?: DependencyList
) {
    useEffect(() => {
        const t = setTimeout(() => {
            fn.call(undefined, deps);
        }, waitTime);

        return () => {
            clearTimeout(t);
        };
    }, deps);
}

export const useInitialEffect = (effect: () => void, deps?: DependencyList) => {
    const hasMountedRef = useRef(false);

    useEffect(() => {
        if (hasMountedRef.current) {
            return effect();
        } else {
            hasMountedRef.current = true;
        }
    }, deps);
};

export const useDebounceInitialEffect = (
    fn: (deps?: DependencyList) => void,
    waitTime: number,
    deps?: DependencyList
) => {
    useEffect(() => {
        const t = setTimeout(() => {
            fn.call(undefined, deps);
        }, waitTime);

        return () => {
            clearTimeout(t);
        };
    }, deps);
};

export function useDebounceState<T>(time: number, val?: T) {
    const [curVal, setVal] = useState(val);
    const [debounce, setdebounce] = useState(val);
    const [state, setState] = useState(false);
    useDebounceEffect(
        () => {
            setdebounce(curVal);
            setState(false);
        },
        time,
        [curVal]
    );
    useEffect(() => {
        setState(true);
    }, [curVal]);
    return [debounce, setVal, state, setdebounce] as [
        ...ReturnType<typeof useState<T>>,
        boolean,
        ReturnType<typeof useState<T>>[1]
    ];
}
