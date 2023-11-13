import { instance } from "..";

export type LevelType = Omit<DataBase["Levels"], "teacherId">;
export type LevelsType = DataBase.WithIdType<LevelType>;
export type LevelsTypeProm = LevelsType & { courseCount: number };

export function getLevels<State extends true | undefined>(
    teacherId: string,
    courseNum: State
) {
    return instance.get<
        ResponseData<{
            levels: State extends true ? LevelsTypeProm[] : LevelsType[];
        }>
    >("getData/api/teacher/levels", {
        params: {
            teacherId,
            courseNum,
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
