import { getLevels } from "@/firebase/func/data/level";
import { wrapRequest, ErrorMessage } from "@/utils/wrapRequest";
import { useQuery } from "@tanstack/react-query";

export function useGetLevels<State extends true | undefined>(
    teacherId: string,
    courseNum: State
) {
    return useQuery({
        queryKey: ["Levels", teacherId, courseNum],
        queryFn: async () => {
            return (await wrapRequest(getLevels(teacherId, courseNum))).levels;
        },
        onError(err: ErrorMessage) {},
    });
}
