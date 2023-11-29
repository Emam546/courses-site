import { useEffect, useRef, useState } from "react";
import { createCollection, getDocRef } from "@/firebase";
import {
    QuerySnapshot,
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
    InfiniteData,
    UseInfiniteQueryOptions,
    UseQueryOptions,
    useInfiniteQuery,
    useQuery,
} from "@tanstack/react-query";
import { useDebounceState } from "@/hooks";
import { ErrorInputShower } from "@/components/common/inputs/main";
import PrimaryButton from "@/components/button";
import queryClient from "@/queryClient";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { FirestoreError } from "firebase/firestore";
export type QuestionType = DataBase.WithIdType<DataBase["Questions"]>;
const limitNum = 10;
export interface Props {
    lesson: DataBase.WithIdType<DataBase["Lessons"]>;
}
const queryKeyInfinity = (lessonId: string) => [
    "infinity",
    "Questions",
    "lessonId",
    lessonId,
];
function _parseTheArray(
    data: InfiniteData<QuestionType[]>
): InfiniteData<QuestionType[]> {
    const allDocs = data.pages.reduce((acc, val) => [...acc, ...val], []);
    const newArr = new Array(Math.ceil(allDocs.length / limitNum)).fill(0);
    const newPages = newArr
        .map<QuestionType[]>(() => {
            const newArr = [];
            for (let i = 0; i < limitNum; i++) {
                const elem = allDocs.shift();
                if (!elem) return newArr;
                newArr.push(elem);
            }
            return newArr;
        })
        .filter((arr) => arr.length);
    return {
        ...data,
        pageParams: newPages.map((arr) => arr.at(-1)),
        pages: newPages,
    };
}
export function deleteInfinityQuestions(id: string, lessonId: string) {
    const data = queryClient.getQueryData<InfiniteData<QuestionType[]>>(
        queryKeyInfinity(lessonId)
    );
    if (!data) return;
    data.pages = data.pages.map((val) => val.filter((val) => val.id != id));
    queryClient.setQueryData<InfiniteData<QuestionType[]>>(
        queryKeyInfinity(lessonId),
        _parseTheArray(data)
    );
}
export function addInfinityQuestions(item: QuestionType, lessonId: string) {
    const data = queryClient.getQueryData<InfiniteData<QuestionType[]>>(
        queryKeyInfinity(lessonId)
    );
    if (!data) return;
    data.pages.at(-1)?.unshift(item);
    queryClient.setQueryData<InfiniteData<QuestionType[]>>(
        queryKeyInfinity(lessonId),
        _parseTheArray(data)
    );
}
export function updateInfinityQuestions(item: QuestionType, lessonId: string) {
    const data = queryClient.getQueryData<InfiniteData<QuestionType[]>>(
        queryKeyInfinity(lessonId)
    );
    if (!data) return;
    data.pages = data.pages.map((val) =>
        val.map((v) => (v.id == item.id ? item : v))
    );
    queryClient.setQueryData<InfiniteData<QuestionType[]>>(
        queryKeyInfinity(lessonId),
        data
    );
}
export function useInfiniteQuestions(
    lessonId: string,
    options?: UseInfiniteQueryOptions<QuestionType[]>
) {
    const key = ["infinity", "_Questions", "lessonId", lessonId];
    function addLastPage(page: any) {
        const pages =
            queryClient.getQueryData<
                QueryDocumentSnapshot<DataBase["Questions"]>[]
            >(key);
        if (pages) return queryClient.setQueryData(key, [...pages, page]);
        queryClient.setQueryData(key, [page]);
    }
    return useInfiniteQuery<QuestionType[]>({
        queryKey: queryKeyInfinity(lessonId),
        queryFn: async ({ pageParam }) => {
            let res: QuerySnapshot<DataBase["Questions"]>;
            if (!pageParam) {
                res = await getDocs(
                    query(
                        createCollection("Questions"),
                        where("lessonId", "==", lessonId),
                        orderBy("createdAt", "desc"),
                        limit(limitNum)
                    )
                );
            } else
                res = await getDocs(
                    query(
                        createCollection("Questions"),
                        where("lessonId", "==", lessonId),
                        orderBy("createdAt", "desc"),
                        startAfter(pageParam),
                        limit(limitNum)
                    )
                );
            addLastPage(res.docs.at(-1)!);

            return res.docs.map<QuestionType>((val) => ({
                ...val.data(),
                id: val.id,
            }));
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.length == 0) return undefined;
            const pages =
                queryClient.getQueryData<
                    QueryDocumentSnapshot<DataBase["Questions"]>[]
                >(key);
            return pages?.at(-1);
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
        queryKey: ["Questions", "lessonId", lessonId, "search", search],
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
export default function QuestionsInfoGetter({ lesson }: Props) {
    const [searchParam, setSearchparams] = useState<string>();
    const searchState = searchParam != "" && searchParam != undefined;
    const { data: dataSearch } = useSearchQuestion(
        lesson.id,
        searchParam ? parseInt(searchParam) : 0,
        {
            enabled: searchState,
        }
    );
    const [curDel, setCurDel] = useState<QuestionType>();
    const {
        hasNextPage,
        isLoading,
        isInitialLoading,
        fetchNextPage,
        error,
        data,
    } = useInfiniteQuestions(lesson.id, { enabled: !searchState });

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

    const questions: QuestionType[] | undefined = searchState
        ? dataSearch?.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        : data?.pages.reduce<QuestionType[]>(
              (acc, val) => [...acc, ...val],
              []
          );

    return (
        <>
            {typeof questions != "undefined" && (
                <div className="tw-mb-4">
                    <SearchForm onSearch={setSearchparams} />
                </div>
            )}

            {!searchState && (
                <>
                    {questions && questions.length > 0 && (
                        <>
                            <div ref={questionContainer}>
                                <QuestionInfoViewer
                                    data={questions}
                                    onDeleteElem={async (v) => {
                                        setCurDel(v);
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
                                data={questions}
                                onDeleteElem={async (v) => {
                                    setCurDel(v);
                                }}
                                noDragging
                            />
                        </>
                    )}
                    {questions && questions.length == 0 && <p>No Results</p>}
                </>
            )}
            <ErrorShower loading={isLoading && !isLoading} />
            <ErrorShower
                error={error as FirestoreError}
                loading={isInitialLoading}
            />
            <DeleteDialog
                onAccept={async () => {
                    await deleteDoc(getDocRef("Questions", curDel!.id));
                    deleteInfinityQuestions(curDel!.id, lesson.id);
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
