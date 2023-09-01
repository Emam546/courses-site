import PrimaryButton from "@/components/button";
import { MainCard } from "@/components/card";
import { WrapElem } from "@/components/common/inputs/styles";
import { DataBase } from "@/data";
import { useForm } from "react-hook-form";
import FinalEditor from "@/components/common/inputs/Editor";
import { useState } from "react";
import {
    EditorState,
    RawDraftContentState,
    ContentState,
    convertToRaw,
} from "draft-js";
import { uuid } from "@/utils";
import ChoicesViewer from "./choicesViewer";
import CheckedInput from "@/components/common/inputs/checked";
export type DataType = Omit<DataBase["Questions"], "lessonId" | "createdAt">;
export interface Props {
    onData: (data: DataType) => Promise<any> | any;
    defaultData?: DataType;
    buttonName: React.ReactNode;
}
export interface ChoiceProps {
    onSubmitQuestion: (quest: RawDraftContentState) => any;
}
function ChoiceArea({ onSubmitQuestion }: ChoiceProps) {
    const [editorState, SetEditorState] = useState<EditorState>(
        EditorState.createEmpty()
    );
    return (
        <div>
            <FinalEditor
                editorState={editorState}
                onEditorStateChange={SetEditorState}
            />
            <div className="tw-flex tw-justify-end tw-mt-3">
                <PrimaryButton
                    type="button"
                    onClick={() => {
                        onSubmitQuestion(
                            convertToRaw(editorState.getCurrentContent())
                        );
                        const newContentState = ContentState.createFromText("");
                        const newEditorState = EditorState.push(
                            editorState,
                            newContentState,
                            "remove-range"
                        );
                        SetEditorState(newEditorState);
                    }}
                >
                    Add Choice
                </PrimaryButton>
            </div>
        </div>
    );
}
export default function LessonGetDataForm({
    defaultData,
    onData,
    buttonName,
}: Props) {
    const { register, handleSubmit, formState, getValues, watch, setValue } =
        useForm<DataType>({
            defaultValues: { ...defaultData, choices: [] },
        });
    const choices = watch("choices");
    return (
        <>
            <MainCard>
                <form
                    onSubmit={handleSubmit(async (data, e) => {
                        const formData = new FormData(e!.target);
                        const answer = formData.get("answer") as string;
                        await onData({ ...data, answer });
                    })}
                >
                    <WrapElem label="Question Area">
                        <FinalEditor
                            onEditorStateChange={(content) =>
                                setValue("quest", JSON.stringify(content))
                            }
                        />
                    </WrapElem>
                    <div className="tw-mt-3">
                        <CheckedInput
                            defaultChecked
                            title="Shuffle Choices"
                            id="shuffle-input"
                            {...register("shuffle")}
                        />
                    </div>
                    <WrapElem
                        label="Choices Area"
                        className="tw-my-3"
                    >
                        <ChoiceArea
                            onSubmitQuestion={(state) => {
                                setValue("choices", [
                                    ...getValues("choices"),
                                    {
                                        id: uuid(),
                                        textContext: JSON.stringify(state),
                                        order: getValues("choices").length,
                                    },
                                ]);
                            }}
                        />
                    </WrapElem>
                    {choices.length == 0 ? (
                        <p>Please Add Some choices</p>
                    ) : (
                        <WrapElem
                            label="Choose The Answer"
                            className="tw-my-3"
                        >
                            <ChoicesViewer
                                data={choices}
                                onChange={(data) => setValue("choices", data)}
                            />
                        </WrapElem>
                    )}

                    <div className="tw-flex tw-justify-end">
                        <PrimaryButton
                            type="submit"
                            disabled={formState.isSubmitting}
                        >
                            {buttonName}
                        </PrimaryButton>
                    </div>
                </form>
            </MainCard>
        </>
    );
}
