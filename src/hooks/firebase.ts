import { getLevels } from "@/firebase/func/data/level";
import { wrapRequest, ErrorMessage } from "@/utils/wrapRequest";
import { useQuery } from "@tanstack/react-query";

export function useGetLevels(teacherId: string) {
    return useQuery({
        queryKey: ["Levels"],
        queryFn: async () => {
            return (await wrapRequest(getLevels(teacherId))).levels;
        },
        onError(err: ErrorMessage) {},
    });
}
