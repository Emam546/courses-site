import PrimaryButton from "@/components/button";
import { CardTitle, MainCard } from "@/components/card";
import ErrorShower from "@/components/common/error";
import CheckedInput from "@/components/common/inputs/checked";
import MainInput from "@/components/common/inputs/main";
import TextArea from "@/components/common/inputs/textArea";
import { WrapElem } from "@/components/common/inputs/styles";
import { Grid2 } from "@/components/grid";
import { DataBase } from "@/data";
import { getDocRef } from "@/firebase";
import DatePicker from "@/components/common/inputs/datePicker";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import FinalEditor from "@/components/common/inputs/Editor";
import UploadVideoYoutube from "@/components/common/uploadVideo";
import { useState } from "react";
import { LinearProgressWithLabel } from "@/components/common/progressBar";
export type DataType = Omit<
    DataBase["Lessons"],
    "courseId" | "order" | "createdAt"
>;
export interface Props {
    courseId: string;
    onData: (data: DataType) => Promise<any> | any;
    defaultData?: DataType;
    buttonName: string;
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
                publishedAt: new Date(),
                hide: true,
                ...defaultData,
            },
        });
    const [videoDesc, setVideoDesc] = useState("");
    const [uploadingState, setUploadingVideoState] = useState(false);
    const [percent, setPercent] = useState(0);
    const [courseData, loading, error] = useDocumentOnce(
        getDocRef("Courses", courseId as string)
    );
    const videoTitle = `Course:${courseData?.data()?.name} - Lesson:${watch(
        "name"
    )}`;
    return (
        <>
            <ErrorShower
                loading={loading}
                error={error}
            />

            {courseData && (
                <>
                    <MainCard>
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
                                    required
                                    {...register("name", {
                                        required: true,
                                    })}
                                />
                                <WrapElem label="Publish Date">
                                    <DatePicker
                                        value={getValues("publishedAt")}
                                        onChange={(val) => {
                                            setValue(
                                                "publishedAt",
                                                val as Date
                                            );
                                        }}
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
                                <WrapElem label="Lesson Description">
                                    <FinalEditor
                                        onContentStateChange={(content) =>
                                            setValue(
                                                "desc",
                                                JSON.stringify(content)
                                            )
                                        }
                                    />
                                </WrapElem>
                            </div>

                            <CardTitle className="tw-mt-3">
                                Upload Video
                            </CardTitle>
                            <div className="tw-space-y-3">
                                <MainInput
                                    title={"Video Title"}
                                    id={"video-title-input"}
                                    disabled
                                    value={videoTitle}
                                />

                                <TextArea
                                    title="Video Description"
                                    id={"video-desc-input"}
                                    onChange={(e) =>
                                        setVideoDesc(e.target.value)
                                    }
                                    value={videoDesc}
                                />
                                <CheckedInput
                                    title="Hide the video"
                                    disabled={watch("video") != undefined}
                                    {...register("video.hide", {
                                        disabled: watch("video") != undefined,
                                    })}
                                />
                                <div className="tw-w-fit tw-mx-auto">
                                    <UploadVideoYoutube
                                        videoTitle={videoTitle}
                                        videoDesc={videoDesc}
                                        onUploadStart={() => {
                                            setUploadingVideoState(true);
                                        }}
                                        onUploading={(v) => {
                                            setPercent(v);
                                        }}
                                        onUploadComplete={(res) => {
                                            console.log(res);
                                            alert("video uploaded sucessfully");
                                            setUploadingVideoState(false);
                                            setValue("video", {
                                                type: "youtube",
                                                hide: false,
                                                id: res.id,
                                            });
                                        }}
                                        onError={(e)=>{
                                            alert("Error happened")
                                            console.error(e);
                                        }}
                                    />
                                </div>
                                {uploadingState && (
                                    <LinearProgressWithLabel value={percent} />
                                )}
                            </div>
                            <div className="tw-flex tw-justify-end">
                                <PrimaryButton
                                    type="submit"
                                    disabled={
                                        formState.isSubmitting || uploadingState
                                    }
                                >
                                    {uploadingState
                                        ? "Uploading Video ..."
                                        : buttonName}
                                </PrimaryButton>
                            </div>
                        </form>
                    </MainCard>
                </>
            )}
        </>
    );
}
