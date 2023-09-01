import { fireStore } from "@/firebase";
import {
    Query,
    collection,
    query,
    where,
    getCountFromServer,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export function useCountDocs<T>(
    query?: Query<T>
): [number | undefined, boolean, any] {
    const [count, setCount] = useState<number>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>();
    useEffect(() => {
        setLoading(true);
        if (query)
            getCountFromServer(query)
                .then((val) => {
                    setCount(val.data().count);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err);
                });
    }, [query]);
    return [count, loading, error];
}
