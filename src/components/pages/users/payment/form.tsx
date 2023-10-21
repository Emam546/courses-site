import PrimaryButton from "@/components/button";
import { MainCard } from "@/components/card";
import SelectInput from "@/components/common/inputs/select";
import { Grid2 } from "@/components/grid";
import { createCollection } from "@/firebase";
import queryClient from "@/queryClient";
import { useGetCourses } from "@/hooks/fireStore";
import { useQuery } from "@tanstack/react-query";
import { getDocs, query, where, orderBy } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
export interface Props {
    levelId: string;
    userId: string;
    onData: (id: string) => any;
}
export function useUnAddedCourses({
    levelId,
    userId,
}: {
    levelId: string;
    userId: string;
}) {
    const [teacher] = useAuthState(auth);
    return useQuery({
        queryKey: ["Courses", "unpaid", userId],
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
                        ["courses", "unpaid", userId],
                        courses?.filter((doc) => doc.id != data.id)
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
