import { FirestoreError } from "firebase/firestore";
import React from "react";
export interface Props {
    error?: FirestoreError;
    loading: boolean;
}
export default function ErrorShower({ error, loading }: Props) {
    return (
        <>
            {loading ? (
                <p>Loading ...</p>
            ) : (
                <>
                    {error && (
                        <div>
                            <h2>{error.code}</h2>
                            <h2>{error.name}</h2>
                            <p className="tw-text-red-600">{error.message}</p>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
