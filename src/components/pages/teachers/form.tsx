import PrimaryButton, { UploadFileButton } from "@/components/button";
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
import { ChangeEvent, useEffect, useState } from "react";

export type AdminDataType = {
    type: DataBase.Roles;
    blocked: boolean;
};
export type OwnerDataType = {
    phone?: string;
    displayName: string;
    photoUrl?: File;
};
type FormData = Omit<DataBase["Teacher"], "photoUrl" | "blocked"> & {
    blocked: boolean;
    photoUrl?: string | File;
};

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
export interface Props {
    teacher: DataBase.WithIdType<DataBase["Teacher"]>;
    onDataAdmin?: (data: AdminDataType) => any;
    onDataOwner?: (data: OwnerDataType) => any;
    onFinish: () => any;
    isAdmin?: boolean;
    isOwner?: boolean;
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
                className="tw-object-cover tw-min-w-full tw-min-h-full"
            />
        </div>
    );
}
export default function TeacherInfoForm({
    teacher: teacher,
    onDataOwner,
    onDataAdmin,
    onFinish,
    isAdmin,
    isOwner,
}: Props) {
    const { register, handleSubmit, formState, getValues, setValue } =
        useForm<FormData>({
            defaultValues: {
                ...teacher,
                photoUrl: undefined,
                blocked: new Boolean(teacher.blocked).valueOf(),
            },
        });
    const [finalImage, setUserImage] = useState<string | undefined>(
        teacher.photoUrl
    );

    return (
        <>
            <form
                onSubmit={handleSubmit(async (data) => {
                    
                    if (isAdmin)
                        await onDataAdmin?.({
                            type: data.type,
                            blocked: data.blocked,
                        });
                    if (isOwner)
                        await onDataOwner?.({
                            phone: data.phone,
                            displayName: data.displayName,
                            photoUrl:
                                data.photoUrl instanceof Blob
                                    ? data.photoUrl
                                    : undefined,
                        });

                    await onFinish?.();
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
                                    src={finalImage}
                                    alt={teacher.displayName}
                                />
                            </div>
                            <div>
                                <div>
                                    <UploadFileButton
                                        id={"upload-user-image"}
                                        disabled={!isOwner}
                                        {...register("photoUrl", {
                                            onChange(
                                                event: ChangeEvent<HTMLInputElement>
                                            ) {
                                                const file =
                                                    event.currentTarget.files?.item(
                                                        0
                                                    );
                                                if (!file) return;
                                                const reader = new FileReader();

                                                reader.addEventListener(
                                                    "load",
                                                    () =>
                                                        setUserImage(
                                                            reader.result?.toString() ||
                                                                ""
                                                        )
                                                );
                                                reader.readAsDataURL(file);
                                                setValue("photoUrl", file);
                                            },
                                        })}
                                        type="file"
                                        accept="image/*"
                                    >
                                        <FontAwesomeIcon
                                            className="tw-text-white tw-mr-1"
                                            icon={faUpload}
                                        />
                                        Upload
                                    </UploadFileButton>
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
