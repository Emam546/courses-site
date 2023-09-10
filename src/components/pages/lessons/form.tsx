import PrimaryButton from "@/components/button";
import { CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import CheckedInput from "@/components/common/inputs/checked";
import MainInput, { ErrorInputShower } from "@/components/common/inputs/main";
import { WrapElem } from "@/components/common/inputs/styles";
import { Grid2 } from "@/components/grid";
import { DataBase } from "@/data";
import DatePicker from "@/components/common/inputs/datePicker";
import { useForm } from "react-hook-form";
import FinalEditor from "@/components/common/inputs/Editor";
import { useGetDoc } from "@/hooks/fireStore";
import { Timestamp } from "firebase/firestore";
import TextArea from "@/components/common/inputs/textArea";
import { isRawDraftContentStateEmpty } from "@/utils/draftjs";
export type DataType = Omit<
    DataBase["Lessons"],
    "courseId" | "order" | "createdAt"
>;
function extractVideoId(youtubeUrl: string) {
    // Regular expression pattern to match YouTube video IDs
    const pattern =
        /(?:\/|v=|vi=|v%3D|u1l=|e\/|embed\/|v\/|watch\?v=|&v=|%2Fvideos%2F|%2Fv%2F|%2Fe%2F|embed\?video=|embed\?v=|embed\?vi=|%2Fembed%2F|www.youtube.com\/watch\?v=|www.youtube.com\/v\/|youtube.com\/watch\?v=|youtube.com\/v\/|youtu.be\/)([a-zA-Z0-9_-]{11})/;

    const match = youtubeUrl.match(pattern);

    if (match && match[1]) {
        return match[1];
    } else {
        return null;
    }
}

export interface Props {
    courseId: string;
    onData: (data: DataType) => Promise<any> | any;
    defaultData?: DataType;
    buttonName: string;
}
export function validateDesc(val: string) {
    if (!val) return "The Field is required";
    if (isRawDraftContentStateEmpty(JSON.parse(val)))
        return "The Field is required";
    return true;
}
export default function LessonGetDataForm({
    courseId,
    defaultData,
    onData,
    buttonName,
}: Props) {
    const { register, handleSubmit, formState, getValues, watch, setValue } =
        useForm<DataType>({
            defaultValues: {
                publishedAt: Timestamp.fromDate(new Date()),
                hide: true,
                ...defaultData,
            },
        });

    const {
        data: courseData,
        isLoading,
        error,
    } = useGetDoc("Courses", courseId);
    const video = watch("video");
    register("publishedAt", {
        required: "You must provide a date",
    });
    register("desc", {
        required: true,
        validate: validateDesc,
    });
    return (
        <>
            <ErrorShower
                loading={isLoading}
                error={error as any}
            />

            {courseData && (
                <>
                    <>
                        <form
                            onSubmit={handleSubmit(async (data) => {
                                if (!data.video?.id) delete data.video;
                                await onData(data);
                            })}
                        >
                            <Grid2>
                                <MainInput
                                    id={"name-input"}
                                    title={"Lesson Name"}
                                    {...register("name", {
                                        required: true,
                                        minLength: 8,
                                    })}
                                    err={formState.errors.name}
                                />
                                <WrapElem label="Publish Date">
                                    <DatePicker
                                        value={getValues(
                                            "publishedAt"
                                        ).toDate()}
                                        onChange={(val) => {
                                            if (!val) return;
                                            setValue(
                                                "publishedAt",
                                                Timestamp.fromDate(val)
                                            );
                                        }}
                                    />
                                    <ErrorInputShower
                                        err={
                                            formState.errors.publishedAt as any
                                        }
                                    />
                                </WrapElem>
                            </Grid2>
                            <div className="tw-mt-3 tw-mb-2">
                                <CheckedInput
                                    title={"Hide Course"}
                                    {...register("hide")}
                                    id={"Hide-input"}
                                />
                            </div>
                            <div className="tw-my-3">
                                <TextArea
                                    id={"brief-desc-input"}
                                    title="Brief Description"
                                    {...register("briefDesc", {
                                        required: true,
                                    })}
                                    err={formState.errors.briefDesc}
                                />
                            </div>
                            <div className="tw-my-3">
                                <WrapElem label="Lesson Description">
                                    <FinalEditor
                                        defaultValue={
                                            defaultData &&
                                            JSON.parse(defaultData.desc)
                                        }
                                        onContentStateChange={(content) =>
                                            setValue(
                                                "desc",
                                                JSON.stringify(content)
                                            )
                                        }
                                    />
                                    <ErrorInputShower
                                        err={formState.errors.desc}
                                    />
                                </WrapElem>
                            </div>

                            <CardTitle className="tw-mt-3">
                                Upload Video
                            </CardTitle>
                            <div className="tw-space-y-3">
                                <CheckedInput
                                    title="Hide the video"
                                    disabled={video == undefined}
                                    {...register("video.hide", {
                                        disabled: video == undefined,
                                    })}
                                />
                                <MainInput
                                    title={"Video Url"}
                                    id={"video-id"}
                                    defaultValue={
                                        video?.id &&
                                        `https://www.youtube.com/watch?v=${video.id}`
                                    }
                                    onChange={(e) => {
                                        const id = extractVideoId(
                                            e.currentTarget.value
                                        );
                                        if (!id) return;
                                        alert("Video Updated successfully");
                                        setValue("video", {
                                            type: "youtube",
                                            hide: false,
                                            id,
                                        });
                                    }}
                                />
                                {video?.id != undefined && <p>Id:{video.id}</p>}
                                {video?.id != undefined && (
                                    <a
                                        href={`https://www.youtube.com/watch?v=${video.id}`}
                                        target="_blank"
                                    >
                                        {`https://www.youtube.com/watch?v=${video.id}`}
                                    </a>
                                )}
                            </div>
                            <div className="tw-flex tw-justify-end tw-mt-3">
                                <PrimaryButton
                                    type="submit"
                                    disabled={formState.isSubmitting}
                                >
                                    {buttonName}
                                </PrimaryButton>
                            </div>
                        </form>
                    </>
                </>
            )}
        </>
    );
}
