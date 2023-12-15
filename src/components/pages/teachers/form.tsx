import PrimaryButton from "@/components/button";
import { Grid2 } from "@/components/grid";
import MainInput from "@/components/common/inputs/main";
import { useForm } from "react-hook-form";
import DatePicker from "@/components/common/inputs/datePicker";
import { WrapElem } from "@/components/common/inputs/styles";
import SelectInput from "@/components/common/inputs/select";
import CheckedInput from "@/components/common/inputs/checked";
import { ObjectEntries, formateDate } from "@/utils";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IsOwnerComp, NotIsOwnerComp } from "@/components/wrappers/wrapper";
import classNames from "classnames";
import Link from "next/link";
import { useDocumentQuery } from "@/hooks/fireStore";
import { Timestamp } from "firebase/firestore";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export type AdminDataType = {
    type: DataBase.Roles;
    blocked: boolean;
};
export type OwnerDataType = {
    phone: string;
    displayName: string;
};
type FormData = DataBase["Teacher"] & { blocked: boolean };

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
export interface Props<Admin extends boolean, Owner extends boolean> {
    teacher: DataBase.WithIdType<DataBase["Teacher"]>;
    onData: (
        data: Admin extends true
            ? AdminDataType
            : Owner extends true
            ? OwnerDataType
            : never
    ) => Promise<any> | any;
    isAdmin?: Admin;
    isOwner?: Owner;
}
const Types: Record<DataBase.Roles, string> = {
    admin: "Admin",
    assistant: "Assistant",
    creator: "Creator",
};
export function TeacherImage({
    src,
    alt,
    className,
}: {
    src?: string;
    alt?: string;
    className?: string;
}) {
    return (
        <div
            className={classNames(
                "tw-flex tw-items-center tw-justify-center tw-overflow-hidden tw-rounded-full tw-aspect-square",
                className
            )}
        >
            <img
                src={src || "/images/profile/user-1.jpg"}
                alt={alt}
                className="tw-min-h-full tw-min-w-full"
            />
        </div>
    );
}
export default function TeacherInfoForm<
    Admin extends boolean,
    Owner extends boolean
>({ teacher: teacher, onData, isAdmin, isOwner }: Props<Admin, Owner>) {
    const { register, handleSubmit, formState, getValues, watch } =
        useForm<FormData>({
            defaultValues: {
                ...teacher,
                blocked: new Boolean(teacher.blocked).valueOf(),
            },
        });

    return (
        <>
            <form
                onSubmit={handleSubmit(async (data) => {
                    if (isAdmin == true)
                        await onData({
                            type: data.type,
                            blocked: data.blocked,
                        } as any);
                    if (isOwner == true)
                        await onData({
                            phone: data.phone,
                            displayName: data.displayName,
                        } as any);

                    alert("Document updated successfully");
                })}
                autoComplete="off"
            >
                <NotIsOwnerComp teacherId={teacher.id}>
                    <div className="tw-mb-4">
                        <div className="tw-w-24">
                            <TeacherImage
                                src={teacher.photoUrl}
                                alt={teacher.displayName}
                            />
                        </div>
                    </div>
                </NotIsOwnerComp>
                <Grid2>
                    <IsOwnerComp teacherId={teacher.id}>
                        <div className="tw-flex tw-items-center tw-space-x-5">
                            <div className="tw-w-12">
                                <TeacherImage
                                    src={teacher.photoUrl}
                                    alt={teacher.displayName}
                                />
                            </div>
                            <div>
                                <div>
                                    <PrimaryButton
                                        type="button"
                                        disabled={!isOwner}
                                    >
                                        <FontAwesomeIcon
                                            className="tw-text-white tw-mr-1"
                                            icon={faUpload}
                                        />
                                        Upload
                                    </PrimaryButton>
                                    {/* <input
                                    type="file"
                                    className="tw-invisible tw-appearance-none tw-w-full tw-h-full tw-z-10"
                                /> */}
                                </div>
                            </div>
                        </div>
                    </IsOwnerComp>
                    <MainInput
                        id={"name-input"}
                        title={"Name"}
                        {...register("displayName", { disabled: !isOwner })}
                        err={formState.errors.displayName}
                    />
                    <MainInput
                        id={"phone-input"}
                        title={"Phone"}
                        {...register("phone", { disabled: !isOwner })}
                        err={formState.errors.contactPhone}
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
                        title={"Permissions"}
                        {...register("type", {
                            required: "Select a Permission Type",
                            disabled: !isAdmin,
                        })}
                        err={formState.errors.type}
                    >
                        {ObjectEntries(Types).map(([key, text]) => {
                            return (
                                <option
                                    value={key}
                                    key={key}
                                >
                                    {text}
                                </option>
                            );
                        })}
                    </SelectInput>
                </Grid2>
                <div className="tw-mt-4">
                    <div className="tw-flex tw-flex-col tw-justify-end">
                        <CheckedInput
                            id={"block-input"}
                            title={"Block State"}
                            {...register("blocked", { disabled: !isAdmin })}
                        />
                        {teacher.blocked && (
                            <BlockedAt
                                userId={teacher.blocked.teacherId}
                                at={teacher.blocked.at}
                            />
                        )}
                    </div>
                </div>
                <div className="tw-mt-4 tw-flex tw-justify-end">
                    <PrimaryButton
                        type="submit"
                        disabled={
                            formState.isSubmitting || (!isOwner && !isAdmin)
                        }
                    >
                        Update
                    </PrimaryButton>
                </div>
            </form>
        </>
    );
}
