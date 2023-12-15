import PrimaryButton from "@/components/button";
import { ErrorInputShower } from "@/components/common/inputs/main";
import { useDebounceState, useLoadingPromise } from "@/hooks";
import { getTeacher } from "@/pages/teachers/info";
import { useEffect, useState } from "react";
import { TeacherComp } from "./info";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ErrorShower from "@/components/common/error";
import { FirestoreError } from "firebase/firestore";

export function SearchTeacherForm({
    onAdd,
}: {
    onAdd: (val: DataBase.WithIdType<DataBase["Teacher"]>) => any;
}) {
    const [searchParam, setSearchparams, settingState] =
        useDebounceState<string>(300, "");
    const [message, setMessage] = useState<string>();
    const [teacher, loading, error] = useLoadingPromise<
        Awaited<ReturnType<typeof getTeacher>>,
        FirestoreError
    >(
        async () => {
            const res = await getTeacher(searchParam!);
            if (res == null) setMessage("The user is not exist");
            return res;
        },
        [searchParam],
        searchParam != ""
    );
    const validState = searchParam != "";
    useEffect(() => {
        setMessage(undefined);
    }, [searchParam]);
    return (
        <div>
            <form
                onSubmit={(e) => e.preventDefault()}
                className="tw-flex tw-items-center tw-gap-y-2 tw-gap-x-2"
            >
                <div className="tw-flex-1">
                    <input
                        type="search"
                        className="form-control placeholder:tw-text-gray-200"
                        onChange={(e) => {
                            setSearchparams(e.currentTarget.value);
                        }}
                        placeholder="search by user id"
                    />
                </div>
                <PrimaryButton
                    type="reset"
                    onClick={() => setSearchparams("")}
                    className="tw-bg-fuchsia-500 hover:tw-bg-fuchsia-600 tw-border-none"
                >
                    Clear
                </PrimaryButton>
            </form>
            <div className="tw-mt-2">
                <ErrorShower
                    loading={loading && validState}
                    error={error}
                />
                {message && <p>{message}</p>}
                {teacher && validState && (
                    <TeacherComp user={teacher}>
                        <button
                            type="button"
                            className="tw-border-none tw-bg-inherit hover:tw-text-blue-500 tw-p-2 tw-text-xl"
                            onClick={async () => {
                                await onAdd(teacher);
                                setSearchparams("");
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </TeacherComp>
                )}
            </div>
        </div>
    );
}
