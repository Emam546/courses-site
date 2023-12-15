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
    UseInfiniteQueryOptions,
    UseQueryOptions,
    useInfiniteQuery,
    useQuery,
} from "@tanstack/react-query";
import { useDebounceState } from "@/hooks";
import PrimaryButton from "@/components/button";
import { FirestoreError } from "firebase/firestore";
import QuestionTeacherSelector from "./selectTeacher";
export type QuestionType = DataBase.WithIdType<DataBase["Questions"]>;
const limitNum = 10;
export interface Props {
    lesson: DataBase.WithIdType<DataBase["Lessons"]>;
    teachers: DataBase.WithIdType<DataBase["Teacher"]>[];
}

export function useInfiniteQuestions(
    lessonId: string,
    filter: string[],
    options?: UseInfiniteQueryOptions<
        QuerySnapshot<DataBase["Questions"]> | null,
        FirestoreError
    >
) {
    const key = ["infinity", "Questions", "lessonId", lessonId, filter];
    return useInfiniteQuery<
        QuerySnapshot<DataBase["Questions"]> | null,
        FirestoreError
    >({
        queryKey: key,
        queryFn: async ({ pageParam }) => {
            let res: QuerySnapshot<DataBase["Questions"]>;
            if (filter.length == 0) return null;
            if (!pageParam) {
                res = await getDocs(
                    query(
                        createCollection("Questions"),
                        where("lessonId", "==", lessonId),
                        where("creatorId", "in", filter),
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
                        where("creatorId", "in", filter),
                        startAfter(pageParam),
                        limit(limitNum)
                    )
                );
            return res;
        },
        getNextPageParam: (lastRes, pages) => {
            if (!lastRes || lastRes.empty) return undefined;
            return lastRes.docs.at(-1);
        },
        staleTime: 0,
        ...options,
    });
}
export function useSearchQuestion(
    lessonId: string,
    search: number,
    options?: UseQueryOptions<
        QuerySnapshot<DataBase["Questions"]>,
        FirestoreError
    >
) {
    return useQuery<QuerySnapshot<DataBase["Questions"]>, FirestoreError>({
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
    const [searchParam, setSearchparams, settingState] =
        useDebounceState<string>(300, "");
    const validState = searchParam == "" || !isNaN(parseInt(searchParam));
    useEffect(() => {
        if (validState) onSearch(searchParam);
    }, [searchParam]);
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
            }}
        >
            <div className="tw-flex tw-items-center tw-gap-y-2  tw-gap-x-2">
                <div className="tw-flex-1">
                    <input
                        type="search"
                        className="form-control placeholder:tw-text-gray-200"
                        onChange={(e) => {
                            setSearchparams(e.currentTarget.value);
                        }}
                        placeholder="search by question id"
                    />
                </div>
                <PrimaryButton
                    type="reset"
                    onClick={() => setSearchparams("")}
                    className="tw-bg-fuchsia-500 hover:tw-bg-fuchsia-600 tw-border-none"
                >
                    Clear
                </PrimaryButton>
            </div>
        </form>
    );
}
export default function QuestionsInfoGetter({ lesson, teachers }: Props) {
    const [searchParam, setSearchparams] = useState<string>();
    const searchState = searchParam != "" && searchParam != undefined;
    const searchQuery = useSearchQuestion(
        lesson.id,
        searchParam ? parseInt(searchParam) : 0,
        {
            enabled: searchState,
        }
    );
    const [ids, setCurIds] = useState(teachers.map((val) => val.id));

    const [curDel, setCurDel] = useState<QuestionType>();
    const {
        hasNextPage,
        isLoading: infiniteQuestionIsLoading,
        fetchNextPage,
        error,
        data,
    } = useInfiniteQuestions(lesson.id, ids, {
        enabled: !searchState,
    });

    const questionContainer = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const element = questionContainer.current;
        const f = () => {
            if (!element) return;
            if (
                element.scrollTop + element.offsetHeight <
                window.innerHeight + window.scrollY
            ) {
                if (!infiniteQuestionIsLoading && hasNextPage && !searchState) {
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
    }, [questionContainer, infiniteQuestionIsLoading, searchState]);

    const questions: QuestionType[] | undefined = searchState
        ? searchQuery.data?.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        : data?.pages.reduce<QuestionType[]>(
              (acc, val) =>
                  val
                      ? [
                            ...acc,
                            ...val.docs.map((doc) => ({
                                id: doc.id,
                                ...doc.data(),
                            })),
                        ]
                      : acc,
              []
          );
    return (
        <>
            <div className="tw-mb-2">
                <SearchForm onSearch={setSearchparams} />
            </div>
            <div className="tw-mb-4">
                <QuestionTeacherSelector
                    teachers={teachers}
                    onSelect={(ids) => {
                        setCurIds(ids);
                    }}
                    defaultData={{
                        ids: Object.fromEntries(
                            teachers.map((val) => [val.id, true])
                        ),
                    }}
                />
            </div>
            {questions && questions.length > 0 && (
                <div
                    className="tw-mt-4"
                    ref={questionContainer}
                >
                    <QuestionInfoViewer
                        data={questions}
                        onDeleteElem={async (v) => {
                            setCurDel(v);
                        }}
                        noDragging
                    />
                </div>
            )}
            {!searchState &&
                questions &&
                questions.length == 0 &&
                ids.length > 0 && (
                    <p className="tw-mb-0">There is no Questions</p>
                )}
            {searchState &&
                questions &&
                questions.length == 0 &&
                ids.length > 0 && <p className="tw-mb-0">No results</p>}

            <ErrorShower
                loading={infiniteQuestionIsLoading && !searchState}
                error={error}
            />
            <ErrorShower
                loading={searchQuery.isLoading && searchState}
                error={searchQuery.error}
            />
            <DeleteDialog
                onAccept={async () => {
                    await deleteDoc(getDocRef("Questions", curDel!.id));
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
