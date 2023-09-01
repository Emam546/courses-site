import Link from "next/link";
import InfoGetter, { CreateElem } from "../../../InsertCommonData";
import { Elem as OrgElem } from "../../../InsertCommonData/Elem";
import { DataBase, WithIdType } from "@/data";

import draftToHtml from "draftjs-to-html";
import { useForm } from "react-hook-form";
import {
    useCollection,
    useCollectionOnce,
} from "react-firebase-hooks/firestore";
import { getDocs, orderBy, query, where } from "firebase/firestore";
import { createCollection } from "@/firebase";
import SelectInput from "@/components/common/inputs/select";
import ErrorShower from "@/components/common/error";
import { useEffect, useState } from "react";
import { Grid2 } from "@/components/grid";
import PrimaryButton from "@/components/button";
import { useCountDocs } from "@/utils/hooks/fireStore";
export type QuestionType = WithIdType<DataBase["Questions"]>;
const Elem = CreateElem<QuestionType>(
    ({ index, props: { data }, ...props }, ref) => {
        return (
            <OrgElem
                {...props}
                ref={ref}
            >
                <Link href={`/questions?id=${data.id}`}>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: draftToHtml(JSON.parse(data.quest)),
                        }}
                    ></div>
                    {data.choices
                        .sort((a, b) => a.order - b.order)
                        .map(({ id, textContext }) => {
                            return (
                                <div
                                    key={id}
                                    className="tw-flex tw-items-center"
                                >
                                    <input
                                        type="text"
                                        name={`quest-${data.id}`}
                                        value={id}
                                        disabled
                                        checked={data.answer == id}
                                    />
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: draftToHtml(
                                                JSON.parse(textContext)
                                            ),
                                        }}
                                    ></div>
                                </div>
                            );
                        })}
                </Link>
            </OrgElem>
        );
    }
);
interface QuestionInfoViewerProps {
    data: QuestionType[];
    onChange: (data: QuestionType[]) => any;
}
function QuestionInfoViewer({ data, onChange }: QuestionInfoViewerProps) {
    return (
        <>
            <InfoGetter
                Elem={Elem}
                data={data}
                onDeleteElem={(v) => {
                    onChange(
                        data
                            .filter((cv) => cv.id != v.id)
                            .map((cv, i) => ({
                                ...cv,
                                order: i,
                            }))
                    );
                }}
                onResort={(indexes) => {
                    onChange(
                        indexes.map((ci, i) => ({
                            ...data[ci],
                            order: i,
                        }))
                    );
                }}
            />
        </>
    );
}

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
                return <option value={doc.id}>{doc.data().name}</option>;
            })}
        </>
    );
}
export interface Props {
    levelId: string;
    onAdd: (data: QuestionType[]) => any;
}

export default function QuestionViewer({ levelId, onAdd }: Props) {
    const [courseId, setCourseId] = useState<string>("");
    const [lessonId, setLessonId] = useState<string>();
    const [submitting, setSubmitting] = useState(false);
    const [courses, loading, error] = useCollectionOnce(
        query(
            createCollection("Courses"),
            where("levelId", "==", levelId),
            orderBy("order")
        )
    );
    const [count] = useCountDocs(
        lessonId != undefined
            ? query(
                  createCollection("Questions"),
                  where("lessonId", "==", lessonId)
              )
            : undefined
    );
    useEffect(() => {
        setLessonId("");
    }, [courseId]);
    return (
        <>
            <form action="">
                <ErrorShower
                    loading={loading}
                    error={error}
                />
                {courses && (
                    <>
                        <Grid2>
                            <SelectInput
                                id="course-input"
                                title="Choose Course"
                                onSelect={(e) => {
                                    setCourseId(e.currentTarget.value);
                                }}
                                value={courseId}
                            >
                                {courses.docs.map((val) => {
                                    return (
                                        <option value={val.id}>
                                            {val.data().name}
                                        </option>
                                    );
                                })}
                            </SelectInput>
                            <SelectInput
                                id="lesson-input"
                                title="Choose Lesson"
                                onSelect={(e) => {
                                    setLessonId(e.currentTarget.value);
                                }}
                                value={lessonId}
                            >
                                {courseId && (
                                    <SelectLevel courseId={courseId} />
                                )}
                            </SelectInput>
                        </Grid2>
                        <div className="tw-flex tw-justify-end tw-my-3">
                            <PrimaryButton
                                onClick={() => {
                                    if (!lessonId) return;
                                    setSubmitting(true);

                                    getDocs(
                                        query(
                                            createCollection("Questions"),
                                            where("lessonId", "==", lessonId)
                                        )
                                    )
                                        .then((docs) => {
                                            onAdd(
                                                docs.docs.map((val) => ({
                                                    ...val.data(),
                                                    id: val.id,
                                                }))
                                            );
                                            setCourseId("");
                                            setLessonId(undefined);
                                        })
                                        .finally(() => {
                                            setSubmitting(false);
                                        });
                                }}
                                disabled={submitting}
                            >
                                Add Questions {count && `(${count})`}
                            </PrimaryButton>
                        </div>
                    </>
                )}
            </form>
        </>
    );
}
