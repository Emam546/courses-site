import { instance } from "..";

export type UserType = DataBase.WithIdType<DataBase["Students"]>;

export function getStudent() {
    return instance.get<
        ResponseData<{
            user: UserType;
        }>
    >("getData/api/student");
}


export const deleteAccount = async () => {
    return await instance.delete<ResponseData<null>>(
        "getData/api/student/delete"
    );
};

