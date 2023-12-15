import SelectInput from "@/components/common/inputs/select";
import { Grid2 } from "@/components/grid";

export type Props = {
    onCourse: (
        course?: DataBase.WithIdType<DataBase["Courses"]> | "All"
    ) => any;
    courses: DataBase.WithIdType<DataBase["Courses"]>[];
    courseId?: string;
};
export function SelectCourse({ onCourse, courses, courseId }: Props) {
    return (
        <Grid2>
            <SelectInput
                id="course-input"
                title="Choose Course"
                onChange={(e) => {
                    const value = e.currentTarget.value;
                    if (value == "") return onCourse("All");
                    onCourse(courses.find((v) => v.id == value));
                }}
                value={courseId || ""}
            >
                (
                <>
                    <option value="">All Students</option>
                    {courses.map((doc) => {
                        return (
                            <option
                                value={doc.id}
                                key={doc.id}
                            >
                                {doc.name}
                            </option>
                        );
                    })}
                </>
                )
            </SelectInput>
        </Grid2>
    );
}
