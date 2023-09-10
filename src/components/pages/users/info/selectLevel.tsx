import SelectInput from "@/components/common/inputs/select";
import { Grid2 } from "@/components/grid";
import { DataBase } from "@/data";
import { createCollection } from "@/firebase";
import { useGetCourses, useGetLevels } from "@/utils/hooks/fireStore";
import { useQuery } from "@tanstack/react-query";
import {
    QueryDocumentSnapshot,
    getDocs,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
export type Props ={
    onCourse: (
        course?: QueryDocumentSnapshot<DataBase["Courses"]> | undefined
    ) => any;
    onLevel: (
        level?: QueryDocumentSnapshot<DataBase["Levels"]> | undefined
    ) => any;
    levelId?: string;
    courseId?: string;
}
export function SelectCourse({ onCourse, onLevel, levelId, courseId }: Props) {
    const { data: levels } = useGetLevels();
    const { data: courses } = useGetCourses(levelId);
    return (
        <Grid2>
            <SelectInput
                id="level-input"
                title="Choose Level"
                onChange={(e) => {
                    if (!levels) return;
                    onLevel(
                        levels.docs.find((v) => v.id == e.currentTarget.value)
                    );
                    onCourse(undefined);
                }}
                value={levelId || ""}
            >
                <option value="">Choose Level</option>
                {levels &&
                    levels.docs.map((doc) => {
                        return (
                            <option
                                value={doc.id}
                                key={doc.id}
                            >
                                {doc.data().name}
                            </option>
                        );
                    })}
            </SelectInput>
            <SelectInput
                id="course-input"
                title="Choose Course"
                onChange={(e) => {
                    if (!courses) return;
                    onCourse(
                        courses.docs.find((v) => v.id == e.currentTarget.value)
                    );
                }}
                value={courseId || ""}
            >
                {courses && (
                    <>
                        <option value="">Choose Course</option>
                        {courses.docs.map((doc) => {
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
                )}
            </SelectInput>
        </Grid2>
    );
}
