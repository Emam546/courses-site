import PrimaryButton from "@/components/button";
import { Grid2 } from "@/components/grid";
import MainInput from "@/components/common/inputs/main";
import { useForm } from "react-hook-form";
import DatePicker from "@/components/common/inputs/datePicker";
import { WrapElem } from "@/components/common/inputs/styles";
import SelectInput from "@/components/common/inputs/select";
import { useDocumentQuery, useGetLevels } from "@/hooks/fireStore";
import CheckedInput from "@/components/common/inputs/checked";
import Link from "next/link";
import { formateDate } from "@/utils";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { Timestamp } from "firebase/firestore";

export type DataType = {
    levelId: string;
    blocked: boolean;
};
type FormData = DataBase["Students"] & { blocked: boolean };
export interface Props {
    user: DataBase["Students"];
    onData: (data: DataType) => Promise<any> | any;
}
function BlockedAt({ userId, at }: { userId: string | true; at: Timestamp }) {
    const [teacher] = useAuthState(auth);
    const [blockedTeacher] = useDocumentQuery(
        "Teacher",
        typeof userId == "string" ? userId : undefined
    );
    return (
        <p className="tw-mb-0">
            Blocked by{` `}
            {userId == teacher?.uid || userId == true ? (
                `You`
            ) : (
                <Link href={`/teachers/info?id=${userId}`}>
                    {blockedTeacher?.data()?.displayName}
                </Link>
            )}
            {` `}at {formateDate(at.toDate())}
        </p>
    );
}
export default function UserInfoForm({ user: user, onData }: Props) {
    const { register, handleSubmit, formState, getValues, watch } =
        useForm<FormData>({
            defaultValues: {
                ...user,
                blocked: new Boolean(user.blocked).valueOf(),
            },
        });
    const { data: levels } = useGetLevels(user.teacherId);

    return (
        <>
            <form
                onSubmit={handleSubmit((data) => {
                    onData({
                        levelId: data.levelId,
                        blocked: data.blocked,
                    });
                })}
                autoComplete="off"
            >
                <Grid2>
                    <MainInput
                        id={"name-input"}
                        title={"Name"}
                        {...register("displayname", { disabled: true })}
                        err={formState.errors.displayname}
                    />
                    <MainInput
                        id={"name-input"}
                        title={"User Name"}
                        {...register("userName", { disabled: true })}
                    />
                    <MainInput
                        id={"phone-input"}
                        title={"Phone"}
                        {...register("phone", { disabled: true })}
                        err={formState.errors.phone}
                    />
                    <MainInput
                        id={"email-input"}
                        title={"Email"}
                        {...register("email", { disabled: true })}
                        err={formState.errors.email}
                    />
                    <WrapElem label="Created At">
                        <DatePicker
                            disabled
                            value={getValues("createdAt").toDate()}
                        />
                    </WrapElem>
                    <SelectInput
                        id={"level-input"}
                        title={"Level"}
                        {...register("levelId", { required: "Select a level" })}
                        err={formState.errors.levelId}
                    >
                        {levels?.docs.map((doc) => {
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
                    <div className="tw-flex tw-flex-col tw-justify-end">
                        <CheckedInput
                            id={"block-input"}
                            title={"Block State"}
                            {...register("blocked")}
                        />
                        {user.blocked && (
                            <BlockedAt
                                userId={user.blocked.teacherId}
                                at={user.blocked.at}
                            />
                        )}
                    </div>
                </Grid2>
                <div className="tw-mt-4 tw-flex tw-justify-end">
                    <PrimaryButton
                        type="submit"
                        disabled={formState.isSubmitting}
                    >
                        Update
                    </PrimaryButton>
                </div>
            </form>
        </>
    );
}
