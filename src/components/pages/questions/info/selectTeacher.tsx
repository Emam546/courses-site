import { useEffect, useState } from "react";
import { getDocRef } from "@/firebase";
import { deleteDoc } from "firebase/firestore";
import DeleteDialog from "../../../common/AlertDialog";
import { useForm } from "react-hook-form";
import { ObjectEntries } from "@/utils";
import { TeacherComp } from "../../lessons/assistants/info";
import CheckedInput, {
    StyledCheckedInput,
} from "@/components/common/inputs/checked";
export type T = DataBase.WithIdType<DataBase["Lessons"]>;

export interface Props {
    teachers: DataBase.WithIdType<DataBase["Teacher"]>[];
    defaultData?: FormData;
    onSelect: (ids: string[]) => any;
}

export type FormData = {
    ids: Record<string, boolean>;
};
export default function QuestionTeacherSelector({
    teachers,
    onSelect,
    defaultData,
}: Props) {
    const [curDel, setCurDel] = useState<T>();
    const { register, watch, getValues } = useForm<FormData>({
        defaultValues: defaultData,
    });
    return (
        <>
            {teachers.length > 0 && (
                <div>
                    {teachers.map((user) => {
                        return (
                            <>
                                <TeacherComp user={user}>
                                    <StyledCheckedInput
                                        type="checkbox"
                                        {...register(`ids.${user.id}`, {
                                            value: true,
                                        })}
                                        onChange={(e) => {
                                            const ids = getValues("ids");
                                            ids[user.id] =
                                                e.currentTarget.checked;
                                            onSelect(
                                                ObjectEntries(ids)
                                                    .filter(
                                                        (
                                                            val
                                                        ): val is [
                                                            string,
                                                            true
                                                        ] => val[1]
                                                    )
                                                    .map(([id]) => id)
                                            );
                                        }}
                                    />
                                </TeacherComp>
                            </>
                        );
                    })}
                </div>
            )}
            {teachers.length == 0 && (
                <p>There is no exams so far please add some Exams</p>
            )}
            <DeleteDialog
                onAccept={async () => {
                    if (curDel)
                        await deleteDoc(getDocRef("Lessons", curDel.id));
                    setCurDel(undefined);
                }}
                onClose={function () {
                    setCurDel(undefined);
                }}
                open={curDel != undefined}
                data={{
                    title: `Delete Lesson`,
                    desc: `Once you click delete, The Lesson and associated data will be permanently deleted and cannot be restored.`,
                    accept: `Delete ${curDel?.name} lesson`,
                    deny: "Keep",
                }}
            />
        </>
    );
}
