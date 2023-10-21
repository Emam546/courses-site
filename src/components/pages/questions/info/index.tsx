import { useEffect, useRef, useState } from "react";
import { DataBase, WithIdType } from "@/data";
import { createCollection, getDocRef } from "@/firebase";
import {
    QuerySnapshot,
    QueryDocumentSnapshot,
    deleteDoc,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    where,
} from "firebase/firestore";
import DeleteDialog from "@/components/common/AlertDialog";
import ErrorShower from "@/components/common/error";
import QuestionInfoViewer from "./questionInfoViewer";
import {
    UseInfiniteQueryOptions,
    UseQueryOptions,
    useInfiniteQuery,
    useQuery,
} from "@tanstack/react-query";
import { useDebounceState } from "@/hooks";
import { ErrorInputShower } from "@/components/common/inputs/main";
import PrimaryButton from "@/components/button";
export type T = WithIdType<DataBase["Questions"]>;

export interface Props {
    lessonId: string;
}
export function useLimitQuestions(
    lessonId: string,
    options?: UseInfiniteQueryOptions<QuerySnapshot<DataBase["Questions"]>>
) {
    return useInfiniteQuery<QuerySnapshot<DataBase["Questions"]>>({
        queryKey: ["questions", "lessonId", lessonId],
        queryFn: async ({ pageParam }) => {
            if (!pageParam)
                return await getDocs(
                    query(
                        createCollection("Questions"),
                        where("lessonId", "==", lessonId),
                        orderBy("createdAt", "desc"),
                        limit(10)
                    )
                );
            return await getDocs(
                query(
                    createCollection("Questions"),
                    where("lessonId", "==", lessonId),
                    orderBy("createdAt", "desc"),
                    startAfter(pageParam),
                    limit(10)
                )
            );
        },
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.size == 0) {
                return undefined;
            }
            return lastPage.docs.at(-1);
        },
        ...options,
    });
}
export function useSearchQuestion(
    lessonId: string,
    search: number,
    options?: UseQueryOptions<QuerySnapshot<DataBase["Questions"]>>
) {
    return useQuery<QuerySnapshot<DataBase["Questions"]>>({
        queryKey: ["questions", "lessonId", lessonId, "search", search],
        queryFn: async ({}) => {
            return await getDocs(
                query(
                    createCollection("Questions"),
                    where("lessonId", "==", lessonId),
                    where("createdAt", "==", new Date(search)),
                    orderBy("createdAt", "desc")
                )
            );
        },

        ...options,
    });
}
export function SearchForm({
    onSearch,
}: {
    onSearch: (val: string | undefined) => any;
}) {
    const [searchParam, setSearchparams, settingState] = useDebounceState<
        string | undefined
    >(300);
    const invalidState =
        searchParam != "" &&
        searchParam != undefined &&
        isNaN(parseInt(searchParam));
    useEffect(() => {
        if (!invalidState) onSearch(searchParam);
    }, [searchParam]);
    return (
        <form className="tw-flex tw-items-center tw-gap-y-2  tw-gap-x-2">
            <div className="tw-flex-1">
                <input
                    className="form-control placeholder:tw-text-gray-400"
                    onChange={(e) => {
                        setSearchparams(e.currentTarget.value);
                    }}
                    placeholder="search by question id"
                />
                <ErrorInputShower
                    className="tw-mb-3"
                    err={
                        invalidState
                            ? {
                                  type: "valueAsNumber",
                                  message: "you muse provide a number",
                              }
                            : undefined
                    }
                />
            </div>
            <PrimaryButton
                type="reset"
                onClick={() => setSearchparams(undefined)}
                className="tw-bg-fuchsia-500 hover:tw-bg-fuchsia-600 tw-border-none"
            >
                Clear
            </PrimaryButton>
        </form>
    );
}
export default function QuestionsInfoGetter({ lessonId }: Props) {
    const [searchParam, setSearchparams] = useState<string>();
    const searchState = searchParam != "" && searchParam != undefined;
    const { data: dataSearch } = useSearchQuestion(
        lessonId,
        searchParam ? parseInt(searchParam) : 0,
        {
            enabled: searchState,
        }
    );
    const [curDel, setCurDel] = useState<T>();
    const {
        hasNextPage,
        isLoading,
        isInitialLoading,
        fetchNextPage,
        error,
        data,
    } = useLimitQuestions(lessonId, { enabled: !searchState });

    const questionContainer = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const element = questionContainer.current;
        const f = () => {
            if (!element) return;
            if (
                element.scrollTop + element.offsetHeight <
                window.innerHeight + window.scrollY
            ) {
                if (!isLoading && hasNextPage) {
                    fetchNextPage();
                }
            }
        };
        window.addEventListener("scroll", f);
        window.addEventListener("resize", f);
        return () => {
            window.removeEventListener("scroll", f);
            window.removeEventListener("resize", f);
        };
    }, [questionContainer, isLoading]);

    const questions:
        | QueryDocumentSnapshot<DataBase["Questions"]>[]
        | undefined = searchState
        ? dataSearch?.docs
        : data?.pages.reduce<QueryDocumentSnapshot<DataBase["Questions"]>[]>(
              (acc, val) => [...acc, ...val.docs],
              []
          );

    return (
        <>
            <ErrorShower
                error={error as any}
                loading={isInitialLoading}
            />
            <div className="tw-mb-2">
                <SearchForm onSearch={setSearchparams} />
            </div>
            {!searchState && (
                <>
                    {questions && questions.length > 0 && (
                        <>
                            <div ref={questionContainer}>
                                <QuestionInfoViewer
                                    data={questions.map((v) => ({
                                        id: v.id,
                                        ...v.data(),
                                    }))}
                                    onDeleteElem={async (v) => {
                                        await deleteDoc(
                                            getDocRef("Questions", v.id)
                                        );
                                    }}
                                    noDragging
                                />
                            </div>
                        </>
                    )}
                    {questions && questions.length == 0 && (
                        <p>
                            There is no Questions so far please add some
                            Questions
                        </p>
                    )}
                </>
            )}
            {searchState && (
                <>
                    {questions && questions.length > 0 && (
                        <>
                            <QuestionInfoViewer
                                data={questions.map((v) => ({
                                    id: v.id,
                                    ...v.data(),
                                }))}
                                onDeleteElem={async (v) => {
                                    await deleteDoc(
                                        getDocRef("Questions", v.id)
                                    );
                                }}
                                noDragging
                            />
                        </>
                    )}
                    {questions && questions.length == 0 && <p>No Results</p>}
                </>
            )}
            <ErrorShower loading={isLoading && !isLoading} />
            <DeleteDialog
                onAccept={async () => {
                    if (curDel)
                        await deleteDoc(getDocRef("Questions", curDel.id));
                    setCurDel(undefined);
                }}
                onClose={function () {
                    setCurDel(undefined);
                }}
                open={curDel != undefined}
                data={{
                    title: `Delete Question`,
                    desc: `Once you click delete, The Question and associated data will be permanently deleted and cannot be restored.`,
                    accept: `Delete Question`,
                    deny: "Keep",
                }}
            />
        </>
    );
}
