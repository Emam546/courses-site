import { DataBase, WithIdType } from "@/data";

import { useCollection } from "react-firebase-hooks/firestore";
import { Query, getDocs, orderBy, query, where } from "firebase/firestore";
import { auth, createCollection } from "@/firebase";
import SelectInput from "@/components/common/inputs/select";
import { useEffect, useState } from "react";
import { Grid2 } from "@/components/grid";
import PrimaryButton from "@/components/button";
import { useCountDocs } from "@/hooks/fireStore";
import { useCourseLevelData } from "./hooks";
import { useQuery } from "@tanstack/react-query";
import { useAuthState } from "react-firebase-hooks/auth";
export type QuestionType = WithIdType<DataBase["Questions"]>;

function SelectLevel({ courseId }: { courseId: string }) {
    const [teacher] = useAuthState(auth);
    const [lessons, loadingLesson, errorLesson] = useCollection(
        query(
            createCollection("Lessons"),
            where("courseId", "==", courseId),
            orderBy("order")
        )
    );
    return (
        <>
            {lessons?.docs.map((doc) => {
                return (
                    <option
                        value={doc.id}
                        key={doc.id}
                    >
                        {doc.data().name}
                    </option>
                );
            })}
        </>
    );
}
export interface Props {
    lessonId: string;
    onAdd: (data: QuestionType[]) => any;
    currentQuestions: QuestionType[];
}

export default function QuestionAdder({
    lessonId,
    onAdd,
    currentQuestions,
}: Props) {
    const [courseId, setCourseId] = useState<string>("");
    const [chosenLessonId, setLessonId] = useState("");
    const [courses, loading, error] = useCourseLevelData(lessonId);
    const queryQuestions = useQuery({
        queryKey: ["Questions", "lessonId", chosenLessonId],
        queryFn: async () => {
            return await getDocs(
                query(
                    createCollection("Questions"),
                    where("lessonId", "==", chosenLessonId)
                )
            );
        },
        enabled: chosenLessonId != undefined,
    });

    return (
        <>
            <div>
                {courses && (
                    <>
                        <Grid2>
                            <SelectInput
                                id="course-input"
                                title="Choose Course"
                                onChange={(e) => {
                                    setCourseId(e.currentTarget.value);
                                }}
                                value={courseId}
                            >
                                <option value="">Choose Course</option>
                                {courses.map((val) => {
                                    return (
                                        <option
                                            key={val.id}
                                            value={val.id}
                                        >
                                            {val.data()!.name}
                                        </option>
                                    );
                                })}
                            </SelectInput>
                            <SelectInput
                                id="lesson-input"
                                title="Choose Lesson"
                                onChange={(e) =>
                                    setLessonId(e.currentTarget.value)
                                }
                            >
                                <option value="">Choose Lesson</option>

                                {courseId != "" && (
                                    <SelectLevel courseId={courseId} />
                                )}
                            </SelectInput>
                        </Grid2>
                        <div className="tw-flex tw-justify-end tw-my-3">
                            <PrimaryButton
                                type="button"
                                onClick={() => {
                                    const questionData = queryQuestions.data;
                                    if (!questionData) return;
                                    onAdd(
                                        questionData.docs.map((val) => ({
                                            ...val.data(),
                                            id: val.id,
                                        }))
                                    );
                                    setCourseId("");
                                    setLessonId("");
                                }}
                                disabled={queryQuestions.isLoading}
                            >
                                Add Questions{" "}
                                {queryQuestions.data != undefined &&
                                    `(${
                                        queryQuestions.data.docs.filter(
                                            (cur) => {
                                                return !currentQuestions.some(
                                                    (doc) => doc.id == cur.id
                                                );
                                            }
                                        ).length
                                    })`}
                            </PrimaryButton>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
