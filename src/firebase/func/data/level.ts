import { instance } from "..";

export type LevelType = Omit<DataBase["Levels"], "teacherId" | "createdAt">;

export function getLevels(teacherId: string) {
    return instance.get<
        ResponseData<{
            levels: DataBase.WithIdType<LevelType>[];
        }>
    >("getData/api/teacher/levels", {
        params: {
            teacherId,
        },
    });
}
export function getLevel(levelId: string) {
    return instance.get<
        ResponseData<{
            level: LevelType;
        }>
    >("getData/api/level", {
        params: { levelId },
    });
}
