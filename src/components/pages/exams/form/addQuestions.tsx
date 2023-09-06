import { DataBase, WithIdType } from "@/data";

import { useCollection } from "react-firebase-hooks/firestore";
import { Query, getDocs, orderBy, query, where } from "firebase/firestore";
import { createCollection } from "@/firebase";
import SelectInput from "@/components/common/inputs/select";
import { useEffect, useState } from "react";
import { Grid2 } from "@/components/grid";
import PrimaryButton from "@/components/button";
import { useCountDocs } from "@/utils/hooks/fireStore";
import { useCourseLevelData } from "./hooks";
import { useQuery } from "@tanstack/react-query";
export type QuestionType = WithIdType<DataBase["Questions"]>;

function SelectLevel({ courseId }: { courseId: string }) {
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
}

export default function QuestionAdder({ lessonId, onAdd }: Props) {
    const [courseId, setCourseId] = useState<string>("");
    const [chosenLessonId, setLessonId] = useState("");
    const [courses, loading, error] = useCourseLevelData(lessonId);
    const queryQuestions = useQuery({
        queryKey: ["question", "lesson", chosenLessonId],
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
                                    const lessonData = queryQuestions.data;
                                    if (!lessonData) return;
                                    onAdd(
                                        lessonData.docs.map((val) => ({
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
                                {queryQuestions.data?.size != undefined &&
                                    `(${queryQuestions.data?.size})`}
                            </PrimaryButton>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
