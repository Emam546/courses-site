import SelectInput from "@/components/common/inputs/select";
import { Grid2 } from "@/components/grid";

import { useGetCourses, useGetLevels } from "@/hooks/fireStore";
import { QueryDocumentSnapshot } from "firebase/firestore";
export type Props = {
    onCourse: (
        course?: QueryDocumentSnapshot<DataBase["Courses"]> | undefined
    ) => any;
    onLevel: (
        level?: QueryDocumentSnapshot<DataBase["Levels"]> | undefined
    ) => any;
    levelId?: string;
    courseId?: string;
};
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
            {levelId && (
                <SelectInput
                    id="course-input"
                    title="Choose Course"
                    onChange={(e) => {
                        if (!courses) return;
                        onCourse(
                            courses.docs.find(
                                (v) => v.id == e.currentTarget.value
                            )
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
            )}
        </Grid2>
    );
}
