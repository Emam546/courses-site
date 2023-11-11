import PrimaryButton from "@/components/button";
import SelectInput from "@/components/common/inputs/select";
import { Grid2 } from "@/components/grid";
import { createCollection } from "@/firebase";
import queryClient from "@/queryClient";
import { useQuery } from "@tanstack/react-query";
import { getDocs, query, where, orderBy } from "firebase/firestore";
import { useForm } from "react-hook-form";
export interface Props {
    levelId: string;
    userId: string;
    onData: (id: string) => any;
}
export const UnpaidCoursesKey = (userId: string, levelId?: string) => [
    "Courses",
    "unpaid",
    userId,
    levelId,
];
export function useUnAddedCourses({
    levelId,
    userId,
}: {
    levelId?: string;
    userId: string;
}) {
    return useQuery({
        queryKey: UnpaidCoursesKey(userId, levelId),
        enabled: typeof levelId == "string",

        queryFn: async () => {
            const payments = await getDocs(
                query(
                    createCollection("Payments"),
                    where("userId", "==", userId)
                )
            );
            const res = await getDocs(
                query(
                    createCollection("Courses"),
                    where("levelId", "==", levelId),
                    orderBy("order")
                )
            );
            return res.docs.filter(
                (doc) =>
                    !payments.docs.some((val) => val.data().courseId == doc.id)
            );
        },
    });
}
export default function PaymentForm({ levelId, userId, onData }: Props) {
    const { data: courses } = useUnAddedCourses({ levelId, userId });
    const { handleSubmit, register, reset } = useForm<{ id: string }>();

    return (
        <>
            <form
                onSubmit={handleSubmit(async (data) => {
                    await onData(data.id);
                    reset();
                    queryClient.setQueryData(
                        UnpaidCoursesKey(userId, levelId),
                        courses
                            ?.filter((doc) => doc.id != data.id)
                            .sort((a, b) => a.data().order - b.data().order)
                    );
                })}
                autoComplete="off"
            >
                <Grid2>
                    <SelectInput
                        id={"course-input"}
                        title={"Choose Course"}
                        {...register("id", { required: true })}
                    >
                        {courses?.map((val) => {
                            <option value="">Choose Course</option>;
                            return (
                                <option
                                    value={val.id}
                                    key={val.id}
                                >
                                    {val.data().name}
                                </option>
                            );
                        })}
                    </SelectInput>
                    <div className="tw-flex tw-justify-end tw-items-end">
                        <PrimaryButton type="submit">Activate</PrimaryButton>
                    </div>
                </Grid2>
            </form>
        </>
    );
}
